let user;

async function initialize(){
    await createComponent("../Components/AppSidebar.html", document.getElementById("sidebar-container"));

    user = await getUser();

    document.getElementById("welcome-banner").textContent = `Welcome ${user.fullName}`;
} initialize();