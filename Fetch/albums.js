$(document).ready(function () {
    const userSelect = $('#userSelect');
    const albumList = $('#albumList');

    // Fetch the list of users from the specified API
    fetch('https://jsonplaceholder.typicode.com/users')
        // After making a successful HTTP request to fetch user data,
        // use the .then() method to handle the response by parsing it as JSON.
        // This step is crucial to convert the raw response into a usable JavaScript object.
        // The response.json() method returns a Promise that resolves with the parsed JSON data.
        .then(response => response.json())
        // For this line the users could be named anything, its just the JSON object returned by the previous line
        .then(users => {
            // Loop through each user and create an option for the userSelect dropdown
            users.forEach(user => {
                // Adds each user to the Select on the html
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.name;
                userSelect.append(option);
            });
            
            // After the users are all loaded trigger the 'change' event on userSelect to load the albums for the default user
            userSelect.trigger('change');
        })
        .catch(error => console.error('Problem fetching users:', error));

    // Attach a 'change' event handler to the userSelect dropdown
    userSelect.on('change', function () {
        // Get the selected user ID
        const userId = $(this).val();
        // Clear the albumList before fetching and displaying new albums
        albumList.empty();
        
        // Fetch the albums for the selected user from the specified API
        // More specifically the ? in the URL indicates a query, in this case the query being to fetch albums IF userId={our indicated userId}
        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
            .then(response => response.json())
            .then(albums => {
                // If albums are found, loop through each and create a list item for it
                if (albums.length > 0) {
                    albums.forEach(album => {
                        const listItem = $('<li>').text(album.title);
                        albumList.append(listItem);
                    });
                } else {
                    // If no albums are found, display a message in a list item
                    const listItem = $('<li>').text('No albums found.');
                    albumList.append(listItem);
                }
            })
            .catch(error => console.error('Error fetching albums:', error));
    });
});