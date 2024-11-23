// document.addEventListener('DOMContentLoaded', function () {

const checkElement = setInterval(() => {
    const commandDialog = document.querySelector(".quick-input-widget");
    if (commandDialog) {
        // Apply the blur effect immediately if the command dialog is visible
        if (commandDialog.style.display !== "none") {
            addBlur();
        }
        // Create an DOM observer to 'listen' for changes in element's attribute.
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (commandDialog.style.display === 'none') {
                        handleEscape();
                    } else {
                        // If the .quick-input-widget element (command palette) is in the DOM
                        // but no inline style display: none, show the backdrop blur.
                        addBlur();
                    }
                }
            });
        });

        observer.observe(commandDialog, { attributes: true });

        // Clear the interval once the observer is set
        clearInterval(checkElement);
    } else {
        console.log("Command dialog not found yet. Retrying...");
    }
}, 500); // Check every 500ms

// Execute when command palette was launched.
document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        event.preventDefault();
        addBlur();
    } else if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        handleEscape();
    }
});

// Ensure the escape key event listener is at the document level
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        handleEscape();
    }
}, true);

function addBlur() {
    const targetDiv = document.querySelector(".monaco-workbench");

    // Remove existing element if it already exists
    const existingElement = document.getElementById("command-blur");
    if (existingElement) {
        existingElement.remove();
    }

    // Create and configure the new element
    const newElement = document.createElement("div");
    newElement.setAttribute('id', 'command-blur');

    newElement.addEventListener('click', function () {
        newElement.remove();
    });

    newElement.style.transition = "opacity .3s";
    newElement.style.opacity = 0;
    setTimeout(() => { newElement.style.opacity = 1 }, 1);

    // Append the new element as a child of the targetDiv
    targetDiv.appendChild(newElement);
}

// Remove the backdrop blur from the DOM when esc key is pressed.
function handleEscape() {
    const element = document.getElementById("command-blur");
    if (element) {
        element.style.opacity = 0;
        setTimeout(() => { element.click(); }, 300);
    }
}
// });