"use strict";
// CP1295 Advanced JavaScript CP1295
// window.alert("Script is running");

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const error1 = $("#name_feedback_id");
    const error2 = $("#seats_feedback_id");
    const error3 = $("#seat_count_feedback_id");
    const input1 = $("#name_id");
    const input2 = $("#seats_id");
    const input3 = $("#seat_count_id");
    input3.value = '0'
    const output = $("#output_ta_id");
    const process = $("#process_ticket_id");
    const reset = $("#clear_fields_id");
    let total = 0;

    process.addEventListener('click', event => {
        const input1Value = input1.value;
        const input2Value = parseInt(input2.value);
        let test1 = 1;
        let test2 = 1;
        let input3Value = parseInt(input3.value);
        
        if (input1.value == '') {
            error1.textContent = 'Name cannot be blank';
            test1 = 0;
        } else {
            test1 = 1;
            error1.textContent = '*';
        }
        
        if (isNaN(input2Value) || 4 < input2Value || input2Value < 0) {
            error2.textContent = 'Seat must be a valid number(1..4)';
            test2 = 0;
        } else {
            test2 = 1;
            error2.textContent = '*';
        }

        if (!isNaN(input3Value)) {
            input3Value = 0;
        }
        
        if (!isNaN(input2Value) && test1 == 1 && test2 == 1) {
            total += input2Value;
            if (total <= 12) {
                output.value += `\n${input1Value} ${input2Value}`;
                input3.value = total;
            } else {
                error3.textContent = 'Total seat count cannot exceed 12'
                total -= input2Value
            }
            
        }
        // For a prettier experience these 2 lines will blank out the 2 entered fields after processing
        //input1.value = '';
        //input2.value = '';
    })

    reset.addEventListener('click', event => {
        input1.value = '';
        input2.value = '';
        input3.value = '';
        error1.textContent = '*';
        error2.textContent = '*';
        error3.textContent = '*';
        output.value = '';
        total = 0;
    })
})

