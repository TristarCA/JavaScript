const $ = selector => document.querySelector(selector);

// An array of colors
const colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'black'];

document.addEventListener("DOMContentLoaded", () => {
    // Sets root to the Div where buttons will be stored
    let root = $("#buttonDiv");

    // Creates an event listener for when the div element is moused over
    root.addEventListener("mouseover", () => {
        root.style.backgroundColor = "grey"
    })
    
    // Creates an event listener for when the mouse leaves the div element
    root.addEventListener("mouseout", () => {
        root.style.backgroundColor = "white"
    })
    
    // A for loop that creates each button within the div, resulting in a 20X20 array of white buttons
    for (j = 1; j <= 20; j++) {
        for (k = 1; k <= 20; k++) {
            const node = document.createElement("button");
            node.textContent = "#";
            node.value = `${j}${k}`;
            i = 1;
            node.name = i;
            node.style.fontFamily = 'Courier New, monospace';
            // Creates an event listener for when each button is moused over to advance it through the colors of the rainbow
            node.addEventListener("mouseover", (evt) => {
                let val = parseInt(evt.target.name)
                evt.target.style.backgroundColor = `${colors[val]}`
                val += 1;
                evt.target.name = `${val}`
            });
            // Creates an event listener for when each button is clicked to reset it back to white
            node.addEventListener("click", (evt) => {
                evt.target.name = 0
                i = 0;
                evt.target.style.backgroundColor = `${colors[evt.target.name]}`
            })
            // appends each button to the div
            root.appendChild(node);
        }
    }
});