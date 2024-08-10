const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin SDK
admin.initializeApp();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    logger.info(`Authenticating token: ${token}`);

    if (!token) {
        logger.warn('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.error(`Token verification error: ${err.message}`);
            return res.sendStatus(403); // Invalid token
        }
        logger.info(`Token verified for user: ${user.userId}`);
        req.user = user;
        next();
    });
};

app.post('/createUser', async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validate the email format before proceeding
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).send('Invalid email format.');
    }

    // Search for an existing user with the provided email
    const usersRef = admin.database().ref('users').orderByChild('email').equalTo(email).limitToFirst(1);
    await usersRef.once('value', async snapshot => {
        if (snapshot.exists()) {
            // User already exists
            return res.status(400).send('A user with this email already exists.');
        } else {
            // No user found, proceed with creating a new user
            const createdAt = new Date().toISOString();
            const role = 'user'; // Default role, can be adjusted based on the application's needs
            const color = Math.floor(Math.random() * 5);

            try {
                // Hash the password before storing it
                const hash = await bcrypt.hash(password, 10);
                // Create user data including the hashed password
                const userData = { fullName, email, password: hash, createdAt, role, onboarding: false, color:color };

                // Add the new user to the database
                const data = await admin.database().ref('users').push(userData);
                // Retrieve and assign the Firebase-generated key as the userId
                const userId = data.key;
                await admin.database().ref('users/' + userId).update({ userId });

                // Also add email to the 'emails' directory
                const emailsRef = admin.database().ref('emails');
                await emailsRef.push(email);

                res.status(200).send('User created successfully and email added to directory');
            } catch (error) {
                logger.error("Error creating user:", error);
                res.status(500).send('Error creating user');
            }
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password, keepMeSignedIn } = req.body;

    const userRef = admin.database().ref('users').orderByChild('email').equalTo(email).limitToFirst(1);
    await userRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const userData = Object.values(snapshot.val())[0];

            bcrypt.compare(password, userData.password, function (err, result) {
                if (err) {
                    logger.error("Authentication error:", err);
                    return res.status(500).send('Authentication error');
                }
                if (result) {
                    const tokenExpiry = keepMeSignedIn ? process.env.KEEP_ME_SIGNED_IN_EXPIRY : process.env.TOKEN_EXPIRY;
                    const token = jwt.sign({
                        email: userData.email,
                        userId: userData.userId
                    }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });

                    // Return the token to the client
                    res.status(200).json({ message: 'Login successful', token });
                } else {
                    res.status(401).send('Incorrect password');
                }
            });
        } else {
            res.status(404).send('There is no user associated with that email address');
        }
    });
});

app.delete('/deleteUser', authenticateToken, async (req, res) => {
    const { email, password } = req.body;

    // Again, assuming there's a way to find a user by email
    const userRef = admin.database().ref('users').orderByChild('email').equalTo(email).limitToFirst(1);
    await userRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const userKey = Object.keys(snapshot.val())[0];
            const userData = Object.values(snapshot.val())[0];
            bcrypt.compare(password, userData.password, function (err, result) {
                if (err) {
                    logger.error("Authentication error:", err);
                    return res.status(500).send('Authentication error');
                }
                if (result) {
                    // Password matches, proceed with deletion
                    admin.database().ref(`users/${userKey}`).remove()
                        .then(() => res.status(200).send('User deleted successfully'))
                        .catch((deleteError) => {
                            logger.error("Error deleting user:", deleteError);
                            res.status(500).send('Error deleting user');
                        });
                } else {
                    // Password does not match
                    res.status(401).send('Incorrect password');
                }
            });
        } else {
            // User not found
            res.status(404).send('User not found');
        }
    });
});

app.get('/getUser', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Assuming this was included in the JWT

    const userRef = admin.database().ref('users').orderByChild('userId').equalTo(userId).limitToFirst(1);
    userRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const userData = Object.values(snapshot.val())[0];
            // Create a copy of userData without the password
            const {password, ...userWithoutPassword} = userData;
            res.json(userWithoutPassword);
        } else {
            res.status(404).send('User not found');
        }
    }).catch(error => {
        res.status(500).send(`Database read failed: ${error}`);
    });
});

exports.app = functions.https.onRequest(app);
