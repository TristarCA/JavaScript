"use strict";
$(document).ready(() => {
    // move focus to first text box
    $("#item_code_id").focus();

    // Radio Button control incl. listener assignment //
    $(":radio").change(() => {
        const selRadioBtnVal = $(":radio:checked").val().toUpperCase();
        $("h3").text(selRadioBtnVal);
    });

    // the handler for the click event of the submit button
    $("#order_form").submit(event => {
        let isValid = true;

        // validate the item_code entry with a regular expression
        const itemCodePattern = /\b[A-Za-z]{4}\b/;
        const itemCode = $("#item_code_id").val().trim();
        if (itemCode == "") {
            $("#item_code_id").next().text("This field is required.");
            isValid = false;
        } else if (!itemCodePattern.test(itemCode)) {
            $("#item_code_id").next().text("Must be exactly 4 Letters");
            isValid = false;
        } else {
            $("#item_code_id").next().text("");
        }
        $("#item_code_id").val(itemCode);

        // prevent the submission of the form if any entries are invalid 
        if (isValid == false) {
            event.preventDefault();
        }
    });
});

