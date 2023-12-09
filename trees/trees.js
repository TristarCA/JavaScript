const $ = selector => document.querySelector(selector); // First we declare $ as our selector for the selection of elements on our page /

const growthFunction = evt => {  // The growthFunction occurs whenever the user hits the submit button /
    $("#forest").innerHTML = "";  // First it resets the #forest field so that any previous text within the div is removed
    var height = $("#height").value;  // Next we get the height of the tree from the #height input box and declare it as the variable height /
    var tree = "";  // We also declare a tree variable to be our string that holds the data to create the tree / 

    if ($("#flip").value == "up") {  // Our first if statement will check if the user has selected for the #flip selector to be upside down or not /
        if ($("#treeType").value == "left") {  // If the tree is facing up we now check to see if the #treeType selector has a value of left /
            var i = 1;  // Next we decare a variable `i` for the repitition of our stars, later we will scale it(1 to 2... 2 to 3... etc as the tree grows) /
            while (height > 0) {  // While our height variable is greater than 0 /
                tree = " ".repeat(height - 1)  // our tree string will use the .repeat function to repeat its character (height - 1) times / 
                tree += "*".repeat(i);  // After the space has been created we will add our star(s) to the tree string /
                height -= 1;  // we will remove 1 from our height variable so the loop ends after it hits 0 /
                i++;  // We add 1 to i and therefore we add a star each loop /
                $("#forest").innerHTML += tree + "\n";  // Finally we end each loop by printing the tree string in the #forest div /
            };
        }

        else 
            if ($("#treeType").value == "right") { // If the #treeType.value is instead right we enter this block /
                while (height > 0) {  // Once again we enter the loop where we check to ensure the height variable is above 0, ending it if height is less than 0 /
                    tree += "*";  // for each loop we will add a star to our tree /
                    height -= 1;  // and then we will subtract 1 from our height variable so the loop will end /
                    $("#forest").innerHTML += tree + "\n";  // Finally we end each loop by printing the tree string in the #forest div /
                }; // Note that for the right side we do not need the space, this is because the right side can simply just be lines of * characters making it simplier /
            }

        else {  // Finally if neither left or right (i.e Full being the only other option) we enter the final block for the right side up tree /
            var maxWidth = 2 * height - 1;  // For the full tree we need a maxWidth variable to create the rows, each row of a tree can have up to (2 * height) - 1 characters /
            for (let i = 1; i <= height; i++) {  // initialize i as 1 and while it is less than or equal to the height continue the loop, after each loop increment i by 1 /
                let star = 2 * i - 1;  // a star variable is declared which holds a number that is equal to (i * 2) - 1 as this will create the stars for each layer (aka odd numbers) /
                let space = (maxWidth - star) / 2;  // next we declare a space variable which holds a number equal to the remaining characters after stars are added devided by 2 for leading white space /
                tree = " ".repeat(space) + "*".repeat(star);  // our tree string is going to be a " " repeated equal to the amount calculated, concatenated with the "*" repeated by the amount calculated /
                $("#forest").innerHTML += tree + "\n";  // Finally we end each loop by printing the tree string in the #forest div /
            };
        };
    }

    else {  // If our #flip value is NOT "up" it has to be down and therefore we enter this else block /
        if ($("#treeType").value == "left") {  // If the tree is facing down we now check to see if the #treeType selector has a value of left /
            let i = height;  // We will declare i to be equal to the height of the tree /
            while (i > 0) {  // While i is larger than 0 /
                tree = " ".repeat(height - i);  // our tree string will be equal to the amount of spaces of our selected height subtract i (First layer has no space, second has 1...) /
                tree += "*".repeat(i);  // add "*" characters to end of the tree string equal to the variable i /
                i--;  // remove 1 from the i variable /
                $("#forest").innerHTML += tree + "\n";  // Finally we end each loop by printing the tree string in the #forest div /
            };
        }
        else 
            if ($("#treeType").value == "right") {  // If the #treeType.value is instead right we enter this block /
                while (height > 0) {  // While the height variable is greater tha 0 /
                    tree = "*".repeat(height);  // the tree string will be equal to the height amount of "*" characters /
                    height--;  // remove 1 from the height variable /
                    $("#forest").innerHTML += tree + "\n";  // Finally we end each loop by printing the tree string in the #forest div /
                };  // Note that for the right side we do not need the space, this is because the right side can simply just be lines of * characters making it simplier /
            }
        else {  // Finally if neither left or right (i.e Full being the only other option) we enter the final block for the right side up tree /
            var maxWidth = 2 * height - 1;  // We now declare a maxWidth variable to create a maximum width for each line /
            for (let i = height; i >= 1; i--) {  // initialize i to be the same as the height, while i is greater than or equal to 1 continue the loop and reduce i by one each loop
                let star = 2 * i - 1;  // for each line star will be equal to double i minus 1 /
                let space = (maxWidth - star) / 2;  // the space will be equal to the remaining space within the row divided by 2 /
                tree = " ".repeat(space) + "*".repeat(star);  // our tree string is going to be a " " repeated equal to the amount calculated, concatenated with the "*" repeated by the amount calculated /
                $("#forest").innerHTML += tree + "\n"  // Finally we end each loop by printing the tree string in the #forest div /
            };
        };
    };
};

document.addEventListener("DOMContentLoaded", () => {
    $("#grow").addEventListener("click", growthFunction);
});