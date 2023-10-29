const $ = selector => document.querySelector(selector);

var Tug = 2;
var Trawler = 3;
var Cruiser = 4;

const ocean = [
    [0, 3, 0, 0, 0],
    [0, 3, 0, 0, 4],
    [0, 3, 0, 0, 4],
    [0, 0, 0, 0, 4],
    [0, 2, 2, 0, 4]
];

let oceanStr = ""
for (row of ocean) {
    for (cell of row) {
        oceanStr += `<button class="button" onclick="function1();function2(this)" value="${cell}" name="button">~</button>`
    }
    oceanStr += `<br>`
    }
$("#ocean").innerHTML = oceanStr

var counter = 0
$("#counter").innerHTML = counter;
function function1() {
    counter +=1
    $("#counter").innerHTML = counter;
}

function function2(button) {
    
    let buttonValue = parseInt(button.value);
    if (buttonValue === 0) {
        button.innerText = "O"
    }
    else {
        button.innerText = "*"
        if (buttonValue === 2) {
            Tug -=1;
            if (Tug === 0) {
                $("#ocean").innerHTML += "<br><span>You sank my Tug Boat!</span>"
            }
        }
        else if (buttonValue === 3) {
            Trawler -= 1;
            if (Trawler === 0) {
                $("#ocean").innerHTML += "<br><span>You sank my Trawler!</span>"
            }
        }
        else {
            Cruiser -= 1;
            if (Cruiser === 0) {
                $("#ocean").innerHTML += "<br><span>You sank my Cruiser!</span>"
            }
        }
    } if (Trawler === 0 & Tug === 0 & Cruiser === 0) {
        $("#ocean").innerHTML += "<br><span>You sank my ships :(!</span>"
    }
}

const water = "~";
const hit = "*";
const miss = "O";

document.addEventListener("DOMContentLoaded", () => {

});