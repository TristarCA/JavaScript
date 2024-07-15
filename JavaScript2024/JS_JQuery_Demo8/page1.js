"use strict";
// Goal 
// #1 create a cookie based on the radio button 
// selection

$(document).ready(() => {
    // move focus to first text box
    $("#item_code_id").focus();

    // Radio Button control incl. listener assignment //
    $(":radio").change(() => {
        const selRadioBtnVal = $(":radio:checked").val();
        $("h3").text(selRadioBtnVal);
    });

    // the handler for the click event of the submit button
    $("#order_form").submit(event => {
        event.preventDefault();
        const itemCode = $("#item_code_id")
        try {
            testInput( itemCode );
            itemCode.next().text("");
            setCookie("aaaa", itemCode.val(), 1); // 1 day persistent cookie
            const selRadioBtnVal = $(":radio:checked").val();
            setCookie("colour", selRadioBtnVal, 1); // 1 day persistent cookie
            $("#message").val("CK GEN");    
        }
        catch(error) {
            itemCode.next().text(error.name + ":" + error.message);
            event.preventDefault();
            $("#message").val("NO CK GEN");    
        }
    });
});

const testInput = (testCode) => {
    const itemCodePattern = /^[A-Za-z]{4}$/;
    var testString = testCode.val().trim(); // has to be var !!
    if (testString == "") {
        throw new Error("This field is required");
        // $("#item_code_id").next().text("This field is required.");
    } else if (!itemCodePattern.test(testString)) {
        throw new Error("Must be exactly 4 Letters");
    } else {
        return true;
    }
}

const setCookie = (name, value, days) => {
    let cookie = name + "=" + encodeURIComponent(value);
    if (days) {
        cookie += "; max-age=" + days * 24 * 60 * 60;
    }
    cookie += "; path=/";
    document.cookie = cookie;
}



const deleteCookie = name =>
    document.cookie = name + "=''; max-age=0; path=/";

/* TRY CATCH handler
$("#order_form").submit(event => {
    const itemCode = $("#item_code_id")
    try {
        testInput( itemCode );
        itemCode.next().text("");
    }
     catch(error) {
        itemCode.next().text(error.name + ":" + error.message);
        event.preventDefault();
    }
});
*/