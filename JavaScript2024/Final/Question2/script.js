// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Handle form submission and store the data in cookies
document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the selected location and speed
    const location = document.querySelector('input[name="location"]:checked').value;
    const speed = document.querySelector('input[name="speed"]:checked').value;

    // Store the values in cookies
    setCookie('location', location, 1);
    setCookie('speed', speed, 1);

    // Redirect to the summary page
    window.location.href = 'summary.html';
});

// Display the data on the summary page
window.onload = function() {
    const location = getCookie('location');
    const speed = getCookie('speed');

    if (location && speed) {
        document.getElementById('trainLocation').innerText = `Train Location: ${location}`;
        document.getElementById('trainSpeed').innerText = `Train Speed: ${speed}`;
    }
};
