function createDocumentElement({ name, image, priority, id, openedLast }) {
    const documentViewer = document.getElementById('document-viewer');

    // Create the anchor element
    const anchor = document.createElement('a');
    anchor.href = `./document?id=${id}`;
    anchor.className = 'document';

    // Create the document banner container
    const bannerContainer = document.createElement('div');
    bannerContainer.className = 'document-banner-container';

    // Create the document priority div
    const priorityDiv = document.createElement('div');
    priorityDiv.className = 'document-priority';
    priorityDiv.style.background =
        priority === 'Minor' ? '#3f7c2c' :
            priority === 'Major' ? '#d3a138' :
                '#cb2e24';
    priorityDiv.textContent = priority;

    // Create the document banner div
    const bannerDiv = document.createElement('div');
    bannerDiv.className = 'document-banner';

    // Create the image element for the banner
    const bannerImage = document.createElement('img');
    bannerImage.src = image;
    bannerImage.alt = `${name} Logo`;

    // Append image to banner div
    bannerDiv.appendChild(bannerImage);

    // Append priority and banner divs to banner container
    bannerContainer.appendChild(priorityDiv);
    bannerContainer.appendChild(bannerDiv);

    // Create the document information div
    const infoDiv = document.createElement('div');
    infoDiv.className = 'document-information';

    // Create the heading element
    const heading = document.createElement('h1');
    heading.textContent = `${name} Supplementals`;

    // Create the paragraph element
    const paragraph = document.createElement('p');
    paragraph.textContent = `Last Opened: ${openedLast}`;

    // Create the document options div
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'document-options';

    // Create the new tab icon
    const newTabIcon = document.createElement('img');
    newTabIcon.src = '../images/icons/new_tab.png';
    newTabIcon.alt = 'Open New Tab';
    newTabIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`./document?id=${id}`, '_blank');
    });

    // Create the print icon
    const printIcon = document.createElement('img');
    printIcon.src = '../images/icons/print.png';
    printIcon.alt = 'Print Supplemental';

    // Append icons to options div
    optionsDiv.appendChild(newTabIcon);
    optionsDiv.appendChild(printIcon);

    // Append heading, paragraph, and options div to info div
    infoDiv.appendChild(heading);
    infoDiv.appendChild(paragraph);
    infoDiv.appendChild(optionsDiv);

    // Append banner container and info div to anchor
    anchor.appendChild(bannerContainer);
    anchor.appendChild(infoDiv);

    // Append anchor to document viewer
    documentViewer.appendChild(anchor);
}

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

    createDocumentElement({
        name: 'Harvard University',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/640px-Harvard_University_coat_of_arms.svg.png',
        priority: 'Critical',
        id: '123',
        openedLast: 'Yesterday 12:17pm'
    });

    createDocumentElement({
        name: 'Yale University',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNEbywDFe04XBc1wfSsAJZaGl-RVQPNPr2g&s',
        priority: 'Major',
        id: '123',
        openedLast: 'Yesterday 12:17pm'
    });

    createDocumentElement({
        name: 'Babson College',
        image: 'https://www.babson.edu/media/images/babson-logo.png',
        priority: 'Minor',
        id: '123',
        openedLast: 'Yesterday 12:17pm'
    });
});