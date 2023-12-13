// Using JavaScript, jQuery, and the Fetch API accessing jsonplaceholder,
// create a simple website that will
// 1. create a selection list of the users found in the user resource. The 
//    initial value of the selection list is to be the first user delivered 
//    from the users resource.
// 2. display the names of the albums that the currently selected user has. 
//    Maybe an unordered list might work well.
// 3. whenever a different user is selected, a new album list should appear.

let user = $("#user");

// This function gets a user's albums and updates the webpage.
function getAlbums (userObj){ // the user object is being passed into this function. 
    return ( 
        // technically, we are returning the value of the fetch operation. But the
        // "side-effect" of this is the processing of the retrieved data and updating
        // the DOM elements.
        fetch ("https://jsonplaceholder.typicode.com/albums?userId="+userObj.id) // include the user id in the url.
        .then (data => data.json()) // turn the data into JS objects - "data" is an array of album objects.
        .then (albums => { // "albums" becomes whatever "data" was.
            $("#albumList").empty(); // makesure to remove any pre-existing albums in the <ul>
            // Then, for each album retrieved, append an <li> element that contains the album title.
            albums.forEach ((item, index, array) => { // in this case i'm not using index and array. They could be omitted.
                $("#albumList").append (`<li>${item.title}</li>`); // shazam!
            });
        })
        .catch () // again, as below, I'm assuming success.
    );
}

$(document).ready (() => {

    $("#user").empty(); // Make sure the selection element has no options.

    // On change event handler. This is triggered whenever the user selection changes.
    $("#user").change(() => { 

        // Do this if the selection should change.

        // 1. Figure out who the newly selected user is (see item #5 below).
        selectedUser = JSON.parse($("#user").find(':selected').attr("info")); 

        // 2. Retrieve and update the albums for that user.
        getAlbums (selectedUser); 
    });

    
    // Now, let's set up the initial state.
    // 1. Get the list of users from jsonplaceholder.com
    fetch ("https://jsonplaceholder.typicode.com/users")

        // 2. Then, if successful, convert that list into JS Object(s) - an array of user objects.
        .then (data => data.json())

        // 3. Then, if successful, process the list of users.
        .then (users => { 
            // "users" is a reference to the array of user objects just retieved in step 2. We need each user's "name".
            // 4. So, for each user in the list...
            users.forEach ((person, index, array) => { // I'm not using "index" or "array". They could be omitted.
                // ... add an option to the select element.
                user.append (`<option info='${JSON.stringify(person)}'>${person.name}</option>`);
                // (Note: Above, the "person" object is stored in the element's "info" 
                //  attribute as JSON for easy retrieval if it is selected.)
            });

            // 5. Set the initial selected user. See how we are getting the person object from 
            // the info attribute of the selected element! Told you so.
            selectedUser = JSON.parse($("#user").find(':selected').attr("info"));

            // 6. get their albums; and this also updates the <ul> that's meant to contain them.
            getAlbums (selectedUser);
        })
        .catch (); // if there should be an error. Lazily, I'm assuming success.

});