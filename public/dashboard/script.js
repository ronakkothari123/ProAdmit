let user;

async function initialize(){
    await createComponent("../Components/AppSidebar.html", document.getElementById("sidebar-container"));

    user = await getUser();

    document.getElementById("welcome-banner").innerHTML = `Welcome ${user.fullName}`;
} initialize();