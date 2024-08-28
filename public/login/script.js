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

    const response = await fetch(`https://us-central1-proadmit-29198.cloudfunctions.net/app/createUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObj),
        mode: 'cors'
    });

    const context = response.status;
    console.log(context);

    if (context === 200) {
        location.href = "../login/"
    } else if(context === 400) {
        document.querySelectorAll(".alert-message")[1].innerHTML = "An account with this email already exists, or the email format is incorrect. Please use a different email or correct the format.";
        document.querySelectorAll(".alert-message")[1].style.display = 'block';
    } else {
        document.querySelectorAll(".alert-message")[1].innerHTML = "Something went wrong on our end. Please try again later.";
        document.querySelectorAll(".alert-message")[1].style.display = 'block';
    }
});

document.getElementById("login-btn").addEventListener("click", async function (e) {
    e.preventDefault();

    const userObj = {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
        keepMeSignedIn: document.getElementById("login-check").classList.contains("checked")
    }

    const response = await fetch(`https://us-central1-proadmit-29198.cloudfunctions.net/app/login`, {
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

        location.href = "../dashboard/";

    } else if(context === 401 || context === 404) {
        document.querySelectorAll(".alert-message")[0].innerHTML = "Invalid email or password. Please double-check your credentials and try again.";
        document.querySelectorAll(".alert-message")[0].style.display = 'block';
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

    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
} initialize();