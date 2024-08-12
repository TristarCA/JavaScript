function validateKeys() {
    var accessCode = document.getElementById('accessCode').value;
    var key1 = document.getElementById('key1').value;
    var key2 = document.getElementById('key2').value;
    var message = document.getElementById('message');

    if (!accessCode) {
        message.style.backgroundColor = 'white';
        message.style.color = 'black';
        message.innerHTML = "Access Code not entered";
        message.style.display = 'block';
    } else if (accessCode === 'secret' && key1 && key2) {
        message.style.backgroundColor = 'green';
        message.innerHTML = "ACCESS GRANTED";
        message.style.display = 'block';
        lockFields();
    } else if (accessCode === 'secret') {
        message.style.backgroundColor = 'yellow';
        message.style.color = 'black';
        message.innerHTML = "Access Code Correct - Keys Invalid";
        message.style.display = 'block';
    } else {
        message.style.backgroundColor = 'red';
        message.innerHTML = "Access Code Incorrect";
        message.style.display = 'block';
    }
}

function lockFields() {
    document.getElementById('accessCode').disabled = true;
    document.getElementById('key1').disabled = true;
    document.getElementById('key2').disabled = true;
}
