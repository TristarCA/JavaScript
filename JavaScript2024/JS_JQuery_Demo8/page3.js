"use strict";

// version 3.3

$(document).ready(() => {
    // move focus to first text box

    // the handler for the click event of the submit button
    $("#order_form").submit(event => {
        event.preventDefault();
        const itemCode = $("#item_code_id");
        const cookie_value = getCookieByName("aaaa");
        $("#message").val(cookie_value);
    });
});


const getCookieByName = name => {
    const cookies = document.cookie;
    // get the starting index of the cookie name followed by an equals sign
    let start = cookies.indexOf(name + "=");
 
    if (start === -1) { // no cookie with that name
        return "";
    } 
    else {
        // ajust so the name and equals sign aren't included in the result
        start = start + (name.length + 1);

        // get the index of the semi-colon at the end of the cookie value
        let end = cookies.indexOf(";", start);
        if (end === -1) { // if no semicolon - last cookie
            end = cookies.length;
        }

        // use the start and end indexes to get the cookie value
        const cookieValue = cookies.substring(start, end);

        // return the decoded cookie value
        return decodeURIComponent(cookieValue);
    }
};

const deleteCookie = name =>
    document.cookie = name + "=''; max-age=0; path=/";

const setCookie = (name, value, days) => {
    let cookie = name + "=" + encodeURICComponent(value);
    if (days) {
        cookie += "; max-age=" + days * 24 * 60 * 60;
    }
    cookie += "; path=/";
    document.cookie = cookie;
}
