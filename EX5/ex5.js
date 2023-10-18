const $ = selector => document.querySelector(selector);

// Let's mess around with an array of arrays.
// Create a table that will display the numeric values that are contained in an array of arrays.

data = [[61,43,84,112,92], [65,8,23,91,87], [2,68,33,45,0], [21,4,59,60,61]];

const redify = (e) => {
    let elem = e.target;
    elem.style.color = "red";
}
const blackify = (e) => {
    let elem = e.target;
    elem.style.color = "black";
}

document.addEventListener("DOMContentLoaded", () => {
    let output="<table>";

    //let rows = data.length;
    //let cols = data[0].length;

    for (let r of data){
        output += "<tr>";
        for (let c of r){
            output += `<td>${c}</td>`;
        }
        output += "</tr>\n";
    }
    output += "</table>";
    console.log (output);
    $("#table").innerHTML = output;
    let tags = document.querySelectorAll("td");
    for (t of tags){
        t.addEventListener("mouseenter", redify);
        t.addEventListener("mouseout", blackify);
    }
});