"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    let dataHistory = [];
    let dayCount = 1;
    let totalPoints = 0;

    $('#data-entry').addEventListener('input', function(e) {
        let errorMessage = validateData(this.value)
        $('#data-error').textContent = errorMessage || '';
    })

    function validateData(input) {
        let number = parseFloat(input)
        let parent = $('#confirm-next');
        let p = parent.previousSibling.previousSibling;
        if (input.trim() === '') {
            $('#confirm-next').hidden = true;
            p.hidden = true;
            return 'Please enter a number'
        } else if (number < 0) {
            $('#confirm-next').hidden = true;
            p.hidden = true;
            return 'Input cannot be a negative number'
        } else if (isNaN(input)) {
            $('#confirm-next').hidden = true;
            p.hidden = true;
            return 'Input must be a non-negative number'
        } else if (number > 50) {
            $('#confirm-next').hidden = true;
            p.hidden = true;
            return 'Input must be between 0 and 50'
        } 
        $('#confirm-next').hidden = false;
        p.hidden = false;
        return null;
    }

    $('#confirm-next').addEventListener('input', function(e) {
        let errorMessage = validateConfirm(this.value)
        $('#confirm-error').textContent = errorMessage || '';
    })

    function validateConfirm(input) {
        if (input.trim() === '') {
            return 'Please enter a \'y\' to confirm data entry'
        } else if (input.trim() != 'y') {
            return 'To submit your score please type \'y\'';
        } return null;
    }

    $('#confirm-next').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.toLowerCase() === 'y') {
            let dataValue = $('#data-entry').value;
            processDailyData(dataValue);
        }
    })

    function processDailyData(value) {
        let score = parseFloat(value);
        let cumulativeData = parseFloat(($('#cumulative-data')).value)
        cumulativeData += score;
        $('#cumulative-data').value = cumulativeData;
        let processedData;
        if ($('#qualify-yes').checked === true) {
            processedData = score * 2
            totalPoints += processedData;
            alert(totalPoints)
        } else if ($('#qualify-no').checked === true) {
            processedData = score;
            totalPoints += processedData;
        }
        dataHistory.push({Original:score, Checked:processedData});
        dayCount++;
        $('#day-counter').value = dayCount;
        updateDisplay();
        resetInputs();
        if (dataHistory.length > 4) {
            updateList();
        }
        
    }

    function updateDisplay() {
    
        $('#average-data').value = totalPoints;
    }

    function resetInputs() {
        $('#data-entry').value = "0"; // Reset daily input
        $('#confirm-entry').value = "0"; // Reset confirmation input
        $('#confirm-next').value = '';
    }

    function updateList() {
        let resultsList = $('#results-list');
        if (!resultsList) {
            resultsList = document.createElement('ul');
            resultsList.id = 'results-list';
            $('#container').appendChild(resultsList);
        } else {
            resultsList.innerHTML = ''; // Clear existing list
        }
        dataHistory.reverse()
        dataHistory.forEach(entry => {
            let li = document.createElement('li');
            li.textContent = `Original: ${entry.Original}, Processed: ${entry.Checked}`;
            resultsList.appendChild(li);
        });

        $('#data-entry').style.display = 'none';
        $('#data-error').style.display = 'none';
        $('#confirm-entry').style.display = 'none';
        $('#radio-buttons').style.display = 'none';
        $('#confirm-next').style.display = 'none';
        let parent = $('#confirm-next');
        let p = parent.previousSibling.previousSibling;
        p.hidden = true;
    }
})