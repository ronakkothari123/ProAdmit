function addDocument(doc) {
    // Create the anchor element
    const documentLink = document.createElement('a');
    documentLink.href = `./document/?id=${doc.id}`;
    documentLink.className = 'document';

    // Create the first div for the image and institution name
    const div1 = document.createElement('div');

    const img = document.createElement('img');
    img.src = '../images/icons/document.png';
    img.alt = '';

    const h1 = document.createElement('h1');
    h1.textContent = doc.institutionName;

    div1.appendChild(img);
    div1.appendChild(h1);

    // Create the second div for the last modified date
    const div2 = document.createElement('div');
    const p1 = document.createElement('p');
    p1.textContent = doc.dateLastModified;
    div2.appendChild(p1);

    // Create the third div for the application deadline
    const div3 = document.createElement('div');
    const p2 = document.createElement('p');
    p2.textContent = doc.applicationDeadline;
    div3.appendChild(p2);

    // Create the progress bar div
    const progressBar = document.createElement('div');
    const isPositiveProgress = doc.currentPercentCompleted >= doc.targetPercentCompleted;

    if(doc.currentPercentCompleted === 100) {
        progressBar.className = 'progress-bar completed-progress-bar';
        const currentDiv = document.createElement('div');

        progressBar.appendChild(currentDiv);

        documentLink.appendChild(div1);
        documentLink.appendChild(div2);
        documentLink.appendChild(div3);
        documentLink.appendChild(progressBar);

        document.querySelector('#documents-list').appendChild(documentLink);

        console.log(doc.institutionName);

        return;
    }

    progressBar.className = `progress-bar ${isPositiveProgress ? 'positive-progress-bar' : 'negative-progress-bar'}`;

    const currentDiv = document.createElement('div');
    const targetDiv = document.createElement('div');
    const remainingDiv = document.createElement('div');
    const markerDiv = document.createElement('div');
    markerDiv.style.left = `calc(${doc.currentPercentCompleted}% - 12px)`;

    if (isPositiveProgress) {
        // Positive progress scenario
        targetDiv.style.width = `${doc.currentPercentCompleted - doc.targetPercentCompleted}%`;
        currentDiv.style.width = `${doc.targetPercentCompleted}%`;
        remainingDiv.style.width = `${100 - doc.currentPercentCompleted}%`;
    } else {
        // Negative progress scenario
        currentDiv.style.width = `${doc.currentPercentCompleted}%`;
        targetDiv.style.width = `${doc.targetPercentCompleted - doc.currentPercentCompleted}%`;
        remainingDiv.style.width = `${100 - doc.targetPercentCompleted}%`;
    }

    progressBar.appendChild(currentDiv);
    progressBar.appendChild(targetDiv);
    progressBar.appendChild(remainingDiv);
    progressBar.appendChild(markerDiv);

    // Append all divs to the anchor element
    documentLink.appendChild(div1);
    documentLink.appendChild(div2);
    documentLink.appendChild(div3);
    documentLink.appendChild(progressBar);

    // Add the anchor element to the #documents-list
    const documentsList = document.querySelector('#documents-list');
    if (documentsList) {
        documentsList.appendChild(documentLink);
    } else {
        console.error('Element with id "documents-list" not found.');
    }
}

function setupDocumentSearch() {
    const searchInput = document.querySelector('#document-search');
    const documentsList = document.querySelector('#documents-list');

    if (!searchInput || !documentsList) {
        console.error('Element with id "document-search" or "documents-list" not found.');
        return;
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        const documentElements = Array.from(documentsList.querySelectorAll('.document'));

        documentElements.forEach(docElement => {
            const institutionNameElement = docElement.querySelector('h1');
            const institutionName = institutionNameElement ? institutionNameElement.textContent.toLowerCase() : '';

            if (institutionName.includes(query)) {
                docElement.style.display = ''; // Show the document
            } else {
                docElement.style.display = 'none'; // Hide the document
            }
        });
    });
}

function reorderDocumentsByUrgency(ascending) {
    const documentsList = document.querySelector('#documents-list');
    if (!documentsList) {
        console.error('Element with id "documents-list" not found.');
        return;
    }

    // Get all .document elements
    const documentElements = Array.from(documentsList.querySelectorAll('.document'));

    // Parse the progress bar data and calculate urgency for each document
    const urgencyData = documentElements.map(docElement => {
        const progressBar = docElement.querySelector('.progress-bar');
        const isPositiveProgress = progressBar.classList.contains('positive-progress-bar');
        const isNegativeProgress = progressBar.classList.contains('negative-progress-bar');

        // Extract widths from the progress bar's children

        let urgency;

        if (isPositiveProgress) {
            const firstDivWidth = parseFloat(progressBar.children[0].style.width);
            const secondDivWidth = parseFloat(progressBar.children[1].style.width);

            // For positive progress bars, urgency is current - target
            urgency = firstDivWidth - (firstDivWidth + secondDivWidth);
        } else if (isNegativeProgress){
            const firstDivWidth = parseFloat(progressBar.children[0].style.width);
            const secondDivWidth = parseFloat(progressBar.children[1].style.width);

            // For negative progress bars, urgency is target - current
            urgency = (firstDivWidth + secondDivWidth) - firstDivWidth;
        } else {
            urgency = -100;
        }

        return { docElement, urgency };
    });

    // Sort the documents by urgency (most behind at the top)
    if(ascending){
        urgencyData.sort((a, b) => b.urgency - a.urgency);
    } else {
        urgencyData.sort((a, b) => a.urgency - b.urgency);
    }

    // Clear the existing order
    documentsList.querySelectorAll(".document").forEach((elem) => {
        elem.remove();
    })

    // Re-append the documents in the new order
    urgencyData.forEach(data => {
        documentsList.appendChild(data.docElement);
    });
}

async function initialize(){
    await createComponent("../Components/AppSidebar.html", document.getElementById("sidebar-container"));

    addDocument({
        id: 123,
        institutionName: 'Babson College',
        dateLastModified: 'August 9th, 2024',
        applicationDeadline: 'November 1st, 2024',
        targetPercentCompleted: 65,
        currentPercentCompleted: 25
    });

    addDocument({
        id: 124,
        institutionName: 'Massachusetts Institute of Technology',
        dateLastModified: 'July 30th, 2024',
        applicationDeadline: 'October 1st, 2024',
        targetPercentCompleted: 10,
        currentPercentCompleted: 75
    });

    addDocument({
        id: 125,
        institutionName: 'Harvard University',
        dateLastModified: 'August 1st, 2024',
        applicationDeadline: 'December 15th, 2024',
        targetPercentCompleted: 80,
        currentPercentCompleted: 40
    });

    addDocument({
        id: 126,
        institutionName: 'Stanford University',
        dateLastModified: 'July 20th, 2024',
        applicationDeadline: 'October 15th, 2024',
        targetPercentCompleted: 50,
        currentPercentCompleted: 75
    });

    addDocument({
        id: 127,
        institutionName: 'University of California, Berkeley',
        dateLastModified: 'June 30th, 2024',
        applicationDeadline: 'September 1st, 2024',
        targetPercentCompleted: 30,
        currentPercentCompleted: 30
    });

    addDocument({
        id: 128,
        institutionName: 'Yale University',
        dateLastModified: 'August 5th, 2024',
        applicationDeadline: 'November 30th, 2024',
        targetPercentCompleted: 90,
        currentPercentCompleted: 60
    });

    addDocument({
        id: 129,
        institutionName: 'Princeton University',
        dateLastModified: 'July 25th, 2024',
        applicationDeadline: 'September 20th, 2024',
        targetPercentCompleted: 20,
        currentPercentCompleted: 10
    });

    addDocument({
        id: 130,
        institutionName: 'Columbia University',
        dateLastModified: 'August 7th, 2024',
        applicationDeadline: 'January 2nd, 2025',
        targetPercentCompleted: 70,
        currentPercentCompleted: 85
    });

    addDocument({
        id: 131,
        institutionName: 'University of Chicago',
        dateLastModified: 'July 15th, 2024',
        applicationDeadline: 'November 5th, 2024',
        targetPercentCompleted: 50,
        currentPercentCompleted: 25
    });

    addDocument({
        id: 132,
        institutionName: 'Dartmouth College',
        dateLastModified: 'August 3rd, 2024',
        applicationDeadline: 'December 10th, 2024',
        targetPercentCompleted: 90,
        currentPercentCompleted: 75
    });

    addDocument({
        id: 133,
        institutionName: 'University of Pennsylvania',
        dateLastModified: 'July 22nd, 2024',
        applicationDeadline: 'October 31st, 2024',
        targetPercentCompleted: 30,
        currentPercentCompleted: 60
    });

    addDocument({
        id: 134,
        institutionName: 'Brown University',
        dateLastModified: 'June 18th, 2024',
        applicationDeadline: 'September 15th, 2024',
        targetPercentCompleted: 100,
        currentPercentCompleted: 100
    });

    setupDocumentSearch();
    const docNum = document.querySelectorAll('.document').length

    if(docNum === 1) document.getElementById("doc-num").innerHTML = `${docNum} Supplemental`;
    else document.getElementById("doc-num").innerHTML = `${docNum} Supplementals`;
} initialize();