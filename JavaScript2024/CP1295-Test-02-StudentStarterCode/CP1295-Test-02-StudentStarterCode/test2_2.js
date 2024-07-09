"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    let dataHistory = [];
    let dayCount = 1;
    $('#day_id').value = 1
    $('#yn_id').hidden = true;
    $('#results_id').hidden = true;

    $('#precipitation_input_id').addEventListener('input', function(e) {
        let errorMessage = validateData(this.value)
        $('#precipitation_input_id').nextSibling.nextSibling.textContent = errorMessage || '';
    })

    function validateData(input) {
        let number = parseFloat(input)
        if (input.trim() === '') {
            $('#yn_id').hidden = true;
            $('#inches_display_id').value = 0;
            return 'Please enter a number'
        } else if (number < 0) {
            $('#yn_id').hidden = true;
            $('#inches_display_id').value = 0;
            return "Error - <0 or > 1000"
        } else if (isNaN(input)) {
            $('#yn_id').hidden = true;
            $('#inches_display_id').value = 0;
            return "Error - Not a Number"
        } else if (number > 1000) {
            $('#yn_id').hidden = true;
            $('#inches_display_id').value = 0;
            return "Error - <0 or > 1000"
        }
        $('#inches_display_id').value = (parseFloat(input * 0.039701)).toFixed(2) 
        $('#yn_id').hidden = false;
        return null;
    }

    $('#yn_input_id').addEventListener('input', function(e) {
        let errorMessage = validateConfirm(this.value)
        $('#yn_input_id').nextSibling.textContent = errorMessage || '';
    })

    function validateConfirm(input) {
        if (input.trim() === '') {
            return 'Please enter a \'y\' to confirm data entry'
        } else if (input.trim() != 'y') {
            return 'To submit your score please type \'y\'';
        } return null;
    }

    $('#yn_input_id').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.toLowerCase() === 'y') {
            let dataValue = $('#precipitation_input_id').value;
            $('#inches_display_id').value = 0;
            $('#yn_id').hidden = true;
            processDailyData(dataValue);
        }
    })

    let percipData = 0;
    let snowData = 0;
    let amount;
    let type;
    function processDailyData(value) {
        let percipTotal = parseFloat(($('#precipitation_input_id')).value)
        if ($('#rain_selected_id').checked === true) {
            percipData += percipTotal
            amount = percipTotal
            $('#rain_total_id').value = percipData
            type = "Rain"
        } else if ($('#snow_selected_id').checked === true) {
            snowData += percipTotal
            amount = percipTotal
            $('#snow_total_id').value = snowData
            type = "Snow"
        }
        dataHistory.push({Day:dayCount, Type:type, Amount:percipTotal});
        dayCount++;
        $('#day_id').value = dayCount;
        resetInputs();
        if (dataHistory.length > 4) {
            $('#yn_id').hidden = false;
            $('#data_entry_id').hidden = true;
            updateList();
        }
    }

    function resetInputs() {
        $('#precipitation_input_id').value = "0"; // Reset daily input
        $('#yn_input_id').value = '';
    }

    function updateList() {
        $('#results_id').hidden = false;
        let resultsList = $('#results-list');
        if (!resultsList) {
            resultsList = document.createElement('ul');
            resultsList.id = 'results-list';
            $("#yn_id").textContent = "";
            $('#results_id').appendChild(resultsList);
        }
        dataHistory.reverse()
        dataHistory.forEach(entry => {
            let li = document.createElement('li');
            li.textContent = `Day: ${entry.Day} ${entry.Type}:${entry.Amount}`;
            resultsList.appendChild(li);
        });

        
    }
})
