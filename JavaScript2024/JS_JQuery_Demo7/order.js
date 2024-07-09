"use strict";
$(document).ready(() => {
    // move focus to first text box
    $("#item_code_id").focus();

    // Radio Button control incl. listener assignment //
    $(":radio").change(() => {
        const selRadioBtnVal = $(":radio:checked").val();
        $("h3").text(selRadioBtnVal);
        let color = selRadioBtnVal.toLowerCase();
        $("h3").css("color", color);
    });

    // the handler for the click event of the submit button
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
        return;
    }
}