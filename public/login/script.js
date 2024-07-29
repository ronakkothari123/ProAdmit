function showElement(elementId) {
    const elements = document.querySelectorAll('#main-wrapper > div');
    elements.forEach(element => {
        element.style.display = 'none';
    });
    document.getElementById(elementId).style.display = 'flex';
}

function checkURLAndShowElement() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('new-user')) {
        showElement('new-user');
    } else if (urlParams.has('forgot-password')) {
        showElement('forgot-password');
    }  else {
        showElement('login-container');
    }
}

document.querySelector("#sign-up-btn").addEventListener("click", async function(e) {
    e.preventDefault();

    const userObj = {
        fullName: `${document.getElementById("sign-up-first").value} ${document.getElementById("sign-up-last").value}`,
        email: document.getElementById("sign-up-email").value,
        password: document.getElementById("sign-up-password").value
    };

    console.log(userObj);

    try {
        const response = await fetch(`https://proadmit-29198-default-rtdb.firebaseio.com/app/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObj),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const context = await response.json();
        console.log(context);
    } catch (error) {
        console.error("Error during fetch operation:", error);
    }
});

document.getElementById("login-btn").addEventListener("click", async function (e) {
    e.preventDefault();

    const userObj = {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
        keepMeSignedIn: document.getElementById("login-check").classList.contains("checked")
    }

    const response = await fetch(`https://proadmit-29198-default-rtdb.firebaseio.com/app/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(userObj),
        mode: 'cors'
    });

    const context = response.status;
    console.log(context);

    if(context === 200){
        const message = await response.json();

        if(userObj.keepMeSignedIn){
            window.localStorage.setItem('token', message.token);
        } else {
            window.sessionStorage.setItem('token', message.token);
        }

        location.href = "../";

    } else {
        const text = await response.text();
        console.log(text);
    }
});


document.querySelectorAll('.password-input div').forEach(toggleDiv => {
    toggleDiv.addEventListener('click', () => {
        const input = toggleDiv.previousElementSibling.previousElementSibling;
        const img = toggleDiv.querySelector('img');

        if (input.type === 'password') {
            input.type = 'text';
            img.src = '../images/icons/shown.png';
        } else {
            input.type = 'password';
            img.src = '../images/icons/hidden.png';
        }

        input.focus();
    });
});

document.querySelectorAll('.custom-checkbox').forEach(function(checkbox) {
    checkbox.addEventListener('click', function() {
        this.classList.toggle('checked');
    });
});

function initialize(){
    checkURLAndShowElement();
} initialize();