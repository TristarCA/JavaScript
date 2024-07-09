"use strict";

const $ = selector => document.querySelector(selector);

const postText = () => {

    const data_item = $("#data_id").value;
    const outTA = $("#ta_id");
    outTA.value += `\n${data_item}`;

};

document.addEventListener("DOMContentLoaded", () => {
    $("#button_id").addEventListener("click", postText);
});