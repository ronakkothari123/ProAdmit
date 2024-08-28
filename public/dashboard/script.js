let user;

function updateProgressBarAndExplanation(progressData) {
    const progressBarContainer = document.querySelector('#progress-bar-container');
    const progressExplanation = document.querySelector('#progress-explanation');

    if (!progressBarContainer || !progressExplanation) {
        console.error('Element with id "progress-bar-container" or "progress-explanation" not found.');
        return;
    }

    // Clear existing progress bar in the container
    progressBarContainer.innerHTML = '';

    // Determine progress status and calculate the difference
    const isAhead = progressData.currentPercentCompleted >= progressData.targetPercentCompleted;
    const progressDifference = Math.abs(progressData.currentPercentCompleted - progressData.targetPercentCompleted);

    // Create the progress bar div
    const progressBar = document.createElement('div');

    if(progressData.currentPercentCompleted === 100) {
        progressBar.className = 'progress-bar completed-progress-bar';
        const currentDiv = document.createElement('div');

        progressBar.appendChild(currentDiv);

        progressBarContainer.appendChild(progressBar);
        progressExplanation.innerHTML = `You're <span style="color:#57138a; font-weight:700;">finished!</span>. You have completed <b>100% of your application</b>.`;

        return;
    }

    progressBar.className = `progress-bar ${isAhead ? 'positive-progress-bar' : 'negative-progress-bar'}`;

    const firstDiv = document.createElement('div');
    const secondDiv = document.createElement('div');
    const thirdDiv = document.createElement('div');
    const markerDiv = document.createElement('div');
    markerDiv.style.left = `calc(${progressData.currentPercentCompleted}% - 12px)`;

    if (isAhead) {
        // Positive progress bar logic
        firstDiv.style.width = `${progressData.targetPercentCompleted}%`;
        secondDiv.style.width = `${progressData.currentPercentCompleted - progressData.targetPercentCompleted}%`;
        thirdDiv.style.width = `${100 - progressData.currentPercentCompleted}%`;
    } else {
        // Negative progress bar logic
        firstDiv.style.width = `${progressData.currentPercentCompleted}%`;
        secondDiv.style.width = `${progressData.targetPercentCompleted - progressData.currentPercentCompleted}%`;
        thirdDiv.style.width = `${100 - progressData.targetPercentCompleted}%`;
    }

    progressBar.appendChild(firstDiv);
    progressBar.appendChild(secondDiv);
    progressBar.appendChild(thirdDiv);
    progressBar.appendChild(markerDiv);

    // Add the progress bar to the container
    progressBarContainer.appendChild(progressBar);

    // Update the progress explanation
    const statusText = isAhead ? 'ahead of pace' : 'behind schedule';
    const statusColor = isAhead ? '#2ea02d' : '#f1624d';
    const paceDifference = isAhead ? 'ahead of schedule' : 'behind schedule';

    progressExplanation.innerHTML = `You're <span style="color:${statusColor}; font-weight:700;">${statusText}</span> and are set to complete the application process <b>${progressDifference}% ${paceDifference}</b>.`;
    document.getElementById("suggestions-header").style.display = 'block';
}

async function initialize(){
    await createComponent("../Components/AppSidebar.html", document.getElementById("sidebar-container"));

    user = await getUser();

    document.getElementById("welcome-banner").innerHTML = `Welcome ${user.fullName}`;

    updateProgressBarAndExplanation({
        currentPercentCompleted: 20,
        targetPercentCompleted: 15
    });
} initialize();