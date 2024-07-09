const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {

    // Question 1.
    var q1area = $("#q1area");
    const color = ["red", "orange", "yellow", "green", "blue", "violet"];
    color.forEach((color) => { // Iterate over each color in the array
        const node = document.createElement("button"); // Create a button element
        node.textContent = color; // Set the button's text content to the color name
        node.style.backgroundColor = color; // Set the button's background color to the color
        q1area.appendChild(node) // Append the button to the "q1area" element
    })

    // Question 2.
    var q2area = $("#q2area");
    const car = [
        { type: "Fiat", model: "500", color: "primer" },
        { type: "Volvo", model: "X90", color: "primer" },
        { type: "VW", model: "Jetta", color: "primer" },
        { type: "Toyota", model: "Matrix", color: "primer" },
        { type: "Mercedes", model: "GLA", color: "primer" },
        { type: "Honda", model: "Civic", color: "primer" }
    ];
    var counter = 0; // Initialize a counter variable
    var carString = " "; // Initialize an empty string to concatenate car information
    car.forEach((car) => { // Iterate over each car in the array
        car.color = color[counter]; // Assign a color from the "color" array to each car
        counter++; // Increment the counter for the next iteration
        carString += `The ${car.type} ${car.model} is ${car.color} <br>`; // Concatenate car information to the carString
    })
    q2area.innerHTML += `<p>${carString}`; // Append the carString to the "q2area" element as a paragraph

    // Question 3. 
    const q3area = $("#q3area");
    // Create a number input element dynamically
    const numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.min = 2;
    numberInput.max = 8;
    numberInput.value = 3;
    q3area.append(numberInput);

    // Initial creation of buttons with a default value of 3
    createButtons(3);

    numberInput.addEventListener("change", function () { // Add an event listener to the number input for the "change" event
        const selectedValue = parseInt(numberInput.value); // Get the selected value from the number input
        clearButtons(); // Clear existing buttons
        createButtons(selectedValue); // Create new buttons based on the selected value

    });

    // Store the reference to the initially selected button
    let storedButton = document.getElementById("button0");

    function createButtons(numberOfButtons) { // Function to create buttons based on the given number
        const buttons = [];

        for (let i = 0; i < numberOfButtons; i++) { // Generate button objects and store them in the 'buttons' array
            let newButton = { id: `button${i}`, text: `button${i}` };
            buttons.push(newButton);
        }

        buttons.forEach((button) => { // Iterate over the buttons array and create button elements dynamically
            const butt = document.createElement("button");
            butt.textContent = button.text;
            butt.id = button.id;
            butt.style.backgroundColor = button.text === "button0" ? "lightblue" : "white";
            q3area.append(butt); // Append the button to the 'q3area' element

            butt.addEventListener("click", () => handleButtonClick(butt, buttons)); // Add a click event listener to each button
        });
    }

    function clearButtons() { // Function to clear existing buttons
        const buttons = document.querySelectorAll("#q3area button"); // Select all button elements within the 'q3area' element
        
        buttons.forEach((button) => { // Iterate over the buttons and remove each one
            button.remove();
        });
    }

    function handleButtonClick(clickedButton, allButtons) { // Function to handle button click events
        clickedButton.style.backgroundColor = "lightblue"; // Set the background color of the clicked button to lightblue

        allButtons.forEach((button) => { // Set the background color of other buttons to white
            if (button.id !== clickedButton.id) {
                document.getElementById(button.id).style.backgroundColor = "white";
            }
        });
        storedButton = clickedButton; // Update the stored button reference
    }
});
