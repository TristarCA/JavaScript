const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    let dataHistory = [];
    let dayCount = 1; // Initialize to Day 1
    let totalProcessed = 0;  // To keep track of the total processed values for average data.

    $('#confirm-next').addEventListener('input', function() {
        if (this.value.toLowerCase() !== 'y') {
            $('#confirm-error').textContent = 'Please enter "y" to confirm and continue.';
        } else {
            $('#confirm-error').textContent = ''; // Clear error message when 'y' is entered
        }
    });

    $('#confirm-next').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.toLowerCase() === 'y') {
            let dataValue = $('#data-entry').value;
            let errorMessage = validateInput(dataValue);
            if (!errorMessage) {
                processDailyData(dataValue); // Process data only after 'y' is entered
                this.value = ''; // Clear after processing
                $('#day-counter').value = `Day ${++dayCount}`; // Increment day and update display
                resetInputs();
                ensureResultsListExists(); // Ensure the list element exists
                updateList(); // Update the list display
            } else {
                $('#data-error').textContent = errorMessage;
            }
        }
    });

    $('#data-entry').addEventListener('input', function() {
        let errorMessage = validateInput(this.value);
        $('#data-error').textContent = errorMessage || ''; // Update the error message dynamically
    });

    function validateInput(value) {
        if (value.trim() === '') {
            return "Please enter a number.";
        }
        if (isNaN(value)) {
            return "Input must be a number.";
        }
        let num = parseFloat(value);
        if (num < 0) {
            return "Number must be non-negative.";
        }
        if (num > 50) {
            return "Number must be less than 51.";
        }
        return null; // Returns null if no errors
    }

    function processDailyData(value) {
        let dailyData = parseFloat(value);
        let isYesSelected = $('#qualify-yes').checked;

        // Adjust the value based on the radio selection
        let processedValue = isYesSelected ? dailyData * 2 : dailyData;
        
        // Update the total processed value and display it
        totalProcessed += processedValue;
        dataHistory.push({ original: dailyData, processed: processedValue }); // Store both values

        updateDisplay();
    }

    function updateDisplay() {
        let total = dataHistory.reduce((acc, curr) => acc + curr.original, 0);

        $('#cumulative-data').value = total.toFixed(2);
        $('#average-data').value = totalProcessed.toFixed(2);
    }

    function ensureResultsListExists() {
        if (!$('#results-list')) { // Check if the UL element exists
            let ul = document.createElement('ul');
            ul.id = 'results-list';
            document.body.appendChild(ul); // Append the UL to the body or a specific container
        }
    }

    function updateList() {
        let resultsList = $('#results-list');
        resultsList.innerHTML = ''; // Clear existing list
        dataHistory.forEach(entry => {
            let li = document.createElement('li');
            li.textContent = `Original: ${entry.original}, Processed: ${entry.processed}`;
            resultsList.appendChild(li);
        });
    }

    function resetInputs() {
        $('#data-entry').value = "0"; // Reset daily input
        $('#confirm-entry').value = "0"; // Reset confirmation input
    }
});
