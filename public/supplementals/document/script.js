document.addEventListener('DOMContentLoaded', function() {
    // Select all supplemental divs
    const supplementalDivs = document.querySelectorAll('.supplemental');

    supplementalDivs.forEach(supplemental => {
        const textarea = supplemental.querySelector('.supplemental-textarea');
        const charCountSpan = supplemental.querySelector('.supplemental-characters span');
        const wordCountSpan = supplemental.querySelector('.supplemental-words span');

        // Function to update character and word count
        function updateCounts() {
            const text = textarea.value.trim();
            const charCount = text.length;
            const wordCount = text ? text.split(/\s+/).length : 0;

            charCountSpan.textContent = charCount;
            wordCountSpan.textContent = wordCount;
        }

        // Add event listener for input event on the textarea
        textarea.addEventListener('input', updateCounts);

        // Initialize counts on page load
        updateCounts();
    });
});

async function initialize(){
    await createComponent("../../Components/AppSidebar.html", document.getElementById("sidebar-container"));
} initialize();