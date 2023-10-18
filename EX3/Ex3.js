// CP1210-JavaScript Inclass Exercise #3 Solution.
// Paul Drover, Sept 2023
// College of the North Atlantic

// 1. Create a page that presents two text fields for a single line of data each.
// 2. When the second field has data (on hitting the enter key), call on a function to process ALL the data that is passed as ONE parameter.
// 3. Write the following about that data onto the page:
//      1. The number of characters
//      2. The number of words
//      3. The character that appears most frequently
//      4. If the data is a number, display that number, otherwise state that the input is not a number
//      5. The data backwards (reverse order)
//      6. The sum of the ascii codes of the data.

// This solution only uses primative data types, Strings, String methods, parseInt(), isNaN(), if, while, and for. 
// There is no explicit use of arrays, other Objects, or user (coder?) defined functions.
// The event handling code is only that which is necessary to service the web page and is as supplied in starting code.

// Oh my, so much to talk about!

// The Approach.
// Generally, this solution (we'll call Method 1) programmatically adds an onkeyup 
// (onkeypress is depreciated) event handling function to the second input field. 
// Alternately, Method 2, we could have put an onkeyup="myFunc()" attribute to the HTML input element instead. 
// * But we don't do both! * Additionally, Method 2 does not have access to the event object, so to find the key
// that was pressed, we would have to examine the value of the element. I think detecting the enter key would be problematic.
// Method 3, we could do something like $("field1").on("keyup", function(evt)) in the function at the bottom of this file. That's very
// very similar to Method 1.
// It's important to choose one method, and not mix them together.


const $ = selector => document.querySelector(selector); // define a function called $

// This function is attached to keypresses on the second text field (see the addEventListener function at the bottom of this file).
// This is a function expression that has one parameter called evt which is a reference to the event that happened.
const action2Function = evt => {

    // So we only want to do something if the key that generated the event is the "Enter" key. All
    // other key press events are ignored.
    if (evt.code == "Enter") { 

        var dataSource = ""; // Always a good idea to initialize variables. Call it "old-school defensive programming".
        var data = "";

        $("#report").innerHTML = ""; // Clear any old report from the screen.

        if ($("#field1").value == "")
            dataSource = $("#field2").value; // if there is no data in field 1, we just take field 2
        else if ($("#field2").value == "")
            dataSource = $("#field1").value; // if there is no data in field 2, we just take field 1
        else
            dataSource = $("#field1").value + " " + $("#field2").value; // otherwise there is data in both fields, we take both and insert a space between them
        // dataSource is a copy of the data that we will not change. When we need to process it, we'll take a copy and work with that.

        // let's start our report. We'll add to it as we go.
        var report = `<br>This is the data: [${dataSource}]. <br>A space has been added between the field data when both fields have values.<br>\n`; 
        data = dataSource;


        // 1. Number of characters - This includes any spaces. Just the length of the string.
        var numChars = data.length;
        report += `1. Character count is ${numChars}<br>\n`;


        // 2. Number of words - We'll count the runs of whitespaces (one or more spaces) between words.
        // For clarity, we are assuming that we will only see spaces as whitespace. We
        // won't consider tab or cr/lf. To add them would only mean adding code that
        // is essentially identical to that for the space case.
        var numWords = 0;   
        data = data.trim(); // First strip any leading and trailing whitespaces.

        var i=0;
        if (data.length > 0){
            ++numWords; // we have at least one word
            while ((i = data.indexOf(" ")) != -1){    // while the search for a space finds something...
                ++numWords;             // if a space is found, then we know there is another word. Remember trim took care of any trailing spaces.
                data = data.slice (i);  // move over the current word to the space just located
                data = data.trim ();    // remove all the leading spaces (there may be more after the one we found)
            }
        } // else there are no words, so there's nothing to do. <- A comment like this is good practice - it shows you considered the else case.
        report += `2. Word count is ${numWords}<br>\n`;


        // 3. The character that appears most frequently
        data = dataSource.trim();   // original data, trimmed
        var dataRest;        // The rest of the data that has yet to be searched
        var mostLetter = ""; // storage for the most common letter
        var mostCount = 0;   // the count of the most common letter
        var currLetter = ""; // storage for the current letter being counted
        var currCount = 0;   // the current count of the current letter

        while (data.length > mostCount){ // if there are not enough letters left to exceed mostCount (or no letters at all), we can stop.
            data = data.trim(); // we are not counting spaces so we trim.

            currLetter = data.charAt(0);    // let's start at the beginning of the data by getting the first letter ...
            currCount = 1;                  // ... of which we know there is at least one.

            dataRest = data.slice(1);

            while ((i = dataRest.indexOf(currLetter))!=-1){ // while there are more occurances of current letter
                ++currCount;                            // count it.
                dataRest = dataRest.slice(i+1);         // move over that found occurance.
            }
            // all occurances of the current letter are now counted.

            // Note here that it doesn't matter if we encounter the same letter again later in the data. It's count will
            // never be as large as the first time it's counted. So it will always be ignored.

            if (currCount > mostCount){  // if we found something bigger than the current biggest... 
                mostLetter = currLetter; // ...update the biggest count and the letter that was counted.
                mostCount = currCount;
            }
            data = data.slice(1); // advance one character;
        }
        // We're done processing the data and have a result.
        report += `3. The first most frequent letter is '${mostLetter}' which appears ${mostCount} time(s)<br>\n`;


        // 4. If the data is a number, display that number, otherwise state that the input is not a number
        if (isNaN (i = parseInt(dataSource)))
            report += `4. The data is not a valid number.<br>\n`;
        else
            report += `4. The data represents the number ${i}<br>\n`;


        // 5. The data backwards (reverse order)
        i = dataSource.length;
        data = "";
        while (i>=0){
            data += dataSource.charAt(i--);
        }   
        report += `5. The data reversed is [${data}]<br>\n`;


        // 6. The sum of the ascii codes of the data.
        var sum = 0;
        for (i=0; i<dataSource.length; ++i)
            sum += dataSource.charCodeAt(i);
        report += `6. Ascii sum of the data is ${sum}\n`;


        // --- we now have all the data we need. ---


        $("#report").innerHTML = report; // display the report on the page (in the element with id "report")

        // clear the fields and reset the focus.
        $("#field1").value = "";
        $("#field2").value = "";
        $("#field1").focus();

        // console.log (report); // dump to the console for debugging.

    } // else (to the if above) ignore other keypresses.
};


// This code is executed when the page generates the DOMContentLoaded event. That happens when the browser is finished loading the HTML of the page. 
// Event handling can be challenging. It's a topic onto itself.
document.addEventListener("DOMContentLoaded", () => {

    // Below is only one event Listener for field2. We don't need an event listener for field1 because we 
    // only take action when there is a value update in field 2. When that happens, we access both fields.

    $("#field2").addEventListener("keyup", action2Function); // we want to fire action2Function whenever there is a keyup event. 
    // For the above, notice no ()'s after action2Function. That's because we are naming the function to execute when the event
    // happens, *not* executing/calling the function here and now.

    // As noted in the approach comments towards the top, instead of the above addEventListener statement, we could have said:
    // $("field2").on ('keyup', action2Function);
    // What's the difference? addEventListener() is a DOM element method, on() is a jQuery method. That's 
    // not always mentioned in google search results. We are not currently using jQuery.

    $("#field1").focus(); // So, now, let's start by placing the focus in field1.

});
