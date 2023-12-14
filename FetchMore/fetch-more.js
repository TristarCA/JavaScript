// Function to fetch user data and set up event listeners
async function getData() {
    try {
        // Fetch user data from the specified URL
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Check if the response is successful (HTTP status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON data
        const data = await response.json();

        // Get references to HTML elements
        const userSelect = document.getElementById('user');
        const userInformationDiv = document.getElementById('userInformation');

        // Populate the dropdown select element with user options
        data.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.text = user.name;
            userSelect.appendChild(option);
        });

        // Log fetched data to the console
        console.log("Fetched data:", data);

        // Add a slight delay before triggering the change event, this is due to the data not loading on launch previously
        setTimeout(() => {
            userSelect.dispatchEvent(new Event('change'));
        }, 100);

        // Add an event listener for the 'change' event on the select element
        userSelect.addEventListener('change', async () => {
            // Get the selected user ID
            const userId = parseInt(userSelect.value);

            /**
             * Find the user in the 'data' array whose ID matches the parsedUserId, for example, if the userId of the userSelect is 5, the next line
             * will data.find this function until it returns true. Therefore it will iterate over all other object with an id until it finds a match.
             */  
            const findUser = (user) => {
                return user.id === userId;
            };

            /**
             * Use the .find() method to get the user whose ID matches the parsedUserId. This will pass each element of 
             * the data array as the user parameter to the findUser function during each iteration. Once a match is found the iteration stops and 
             * the object that the iteration stops on is returned as a result.
             */ 
            const foundUser = data.find(findUser);

            // Display user information in the specified div
            displayUserInfo(userInformationDiv, foundUser);

            // Fetch and display more data based on the user ID
            await getMoreData(userId);
        });
    } catch (error) {
        // Log any errors that occur during the process
        console.error("Error fetching data:", error);
    }
}

// Function to fetch additional data based on the user ID
async function getMoreData(userId) {

    // Fetch data from the second URL
    const second_response = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
    const second_data = await second_response.json();

    // Get a reference to the HTML element for displaying the second set of data
    const ulElement = document.getElementById('albumList');

    // Clear the existing content of the list element
    ulElement.innerHTML = '';

    // Populate the list element with new data
    second_data.forEach(album => {
        const li = document.createElement('li');
        li.textContent = `Album ID: ${album.id}  ----------- Title: ${album.title}`;
        ulElement.appendChild(li);
    });
}

// Function to display user information in a specified div
function displayUserInfo(userInformationDiv, userInfo) {
    // Clear the existing content of the user information div
    userInformationDiv.innerHTML = '';

    // Create a paragraph element for displaying user information
    const userInfoParagraph = document.createElement('p');

    // Define lines of user information in an array
    const lines = [
        `User ID: ${userInfo.id}`,
        `Name: ${userInfo.name}`,
        `Username: ${userInfo.username}`,
        `Email: ${userInfo.email}`,
        `Phone: ${userInfo.phone}`,
        `Website: ${userInfo.website}`,
        `Address: ${userInfo.address.suite} ${userInfo.address.street}, ${userInfo.address.city} ${userInfo.address.zipcode}`,
        `Company: ${userInfo.company.name}`,
        `Catch phrase: ${userInfo.company.catchPhrase}`,
        `BS?: ${userInfo.company.bs}`
    ];

    // Iterate through the lines and append them to the paragraph element
    lines.forEach(line => {
        const textNode = document.createTextNode(line);
        userInfoParagraph.appendChild(textNode);
        userInfoParagraph.appendChild(document.createElement('br')); // Add line break
    });

    // Append the paragraph element to the user information div
    userInformationDiv.appendChild(userInfoParagraph);
}

// Event listener for the 'DOMContentLoaded' event to ensure the page has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call the getData function when the DOM has fully loaded
    getData();
});
