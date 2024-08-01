document.addEventListener('DOMContentLoaded', async () => {
    await createComponent("../Components/AppNavbar.html", document.getElementById("navbar-container"));

    const input = document.getElementById('navbar-input');
    const inputWrapper = document.getElementById('navbar-input-wrapper');

    input.addEventListener('focus', () => {
        inputWrapper.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        inputWrapper.classList.remove('focused');
    });
});