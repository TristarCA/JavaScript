document.addEventListener("DOMContentLoaded", function() {
    const $ = function (id) {
        return document.getElementById(id);
    };

var createTable = function () {
    const item = ["bills", "laundry", "phone", "drugs", "electricity", "groceries"];
    const cost = [40, 50, 60, 70, 80, 90];
    var string = "<tr><th>Item</th><th>Price</th></tr>"
    var total = 0;
    
    for (i=0;i<item.length;i++) {
        string += "<tr><td>" + item[i] + "</td><td>" + cost[i] + "</td></tr>"
        total += cost[i];
    }
    string += "<tr><td>Total:</td> <td>" + total + "</td></tr>" 
    $("payments").innerHTML = string;

}

var createTree = function () {
    var string = "";
    for (var i=0;i<10;i++) {
        let space = 10-i;
        let star = i+1+i;
        string += "&nbsp".repeat(space) + "*".repeat(star) + "<br>";
    }
    $("playground").innerHTML = string
}


window.onload = function () {
    $("clicker").onclick = createTable;
    $("payments").innerHTML = "";
    $("tree").onclick = createTree;
}
});
