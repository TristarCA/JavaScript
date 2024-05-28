"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const error1 = $("#error1");
    const error2 = $("#error2");
    const error3 = $("#error3");
    const input1 = $("#input1");
    const input2 = $("#input2");
    const input3 = $("#input3");
    input3.value = '0'
    const output = $("#output");
    const process = $("#process");
    const reset = $("#reset");
    let total = 0;

    process.addEventListener('click', event => {
        const input1Value = input1.value;
        const input2Value = parseInt(input2.value);
        let test = 1;
        let input3Value = parseInt(input3.value);
        
        if (isNaN(input2Value) || 10 < input2Value || input2Value < 0) {
            error2.textContent = 'Please enter a number between 1 and 10'
            test = 0
        } else {
            test = 1
            error2.textContent = '';
        }

        if (!isNaN(input3Value)) {
            input3Value = 0;
        }
        
        if (!isNaN(input2Value) && test == 1) {
            output.value += `${input1Value} ${input2Value}\n`;
            total += input2Value;
            input3.value = total;
        }

        input1.value = '';
        input2.value = '';
    })

    reset.addEventListener('click', event => {
        input1.value = '';
        input2.value = '';
        input3.value = '';
        error1.textContent = '';
        error2.textContent = '';
        error3.textContent = '';
        output.value = '';
        total = 0;
    })
})