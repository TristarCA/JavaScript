// initialize the count as 0
// listen for clicks on the increment button
// increment the count variable when button is clicked
// change the count-el in the HTML to reflect the new count

let count = 0;

function increment() {
    count += 1;
    document.getElementById("count-el").innerHTML = count;
}

function save() {
    console.log(count);
}