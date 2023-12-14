// DOM element selection
const $ = selector => document.querySelector(selector);

// Create an array to store preloaded images
const images = [];

// Initialize variables for controlling the slideshow
let imageCounter = 0;
let timer = null;
let image = null;

// Reference key elements in the DOM
const mainImage = $("#main_image");   // the img element for the show
const caption = $("#caption");        // the h2 element for the caption
const startButton = $("#start");       // the "Start" button
const pauseButton = $("#pause");       // the "Pause" button

// Function to advance the slideshow and update the display
const runSlideShow = function() {
    // Increment the image counter, ensuring it wraps around to 0 when reaching the end
    imageCounter++
    if (imageCounter >= 8) {
        imageCounter = 0;
    }

    // Retrieve the next image from the images list based on the updated counter
    image = images[imageCounter];

    // Update the source and alt attributes of the mainImage element
    mainImage.src = image.src;
    mainImage.alt = image.alt;

    // Update the text content of the caption element with the alt text of the current image
    caption.textContent = image.alt;
};
         
// Execute code when the DOM has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get all anchor elements within the image_list unordered list
    const links = $("#image_list").querySelectorAll("a");
    
    // Process image links
    for (let link of links) {
        // Preload image and copy title properties
        image = new Image();
        image.src = link.href;
        image.alt = link.title;

        // Add image to the array 
        images.push(image)
    }

    // Attach start and pause event handlers
    startButton.addEventListener("click", () => {
        // Start the slideshow and update button states
        timer = setInterval(runSlideShow, 2000);
        startButton.disabled = true;
        pauseButton.disabled = false;
    });

    pauseButton.addEventListener("click", () => {
        // Pause the slideshow and update button states
        clearInterval(timer);
        startButton.disabled = false;
        pauseButton.disabled = true;
    });
});