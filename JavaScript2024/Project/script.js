// Utility functions that don't interact with the DOM on load
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function createErrorMessage(inputElement) {
    let errorMessage = document.createElement('span');
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
    return errorMessage;
}

const boxcarIdError = createErrorMessage($('#boxcar-id'));
const tareWeightError = createErrorMessage($('#tare-weight'));
const maxGrossWeightError = createErrorMessage($('#max-gross-weight'));

$('#cargo-weight').value = '0'

// Validation functions
function validateBoxcarId() {
    const regex = /^BX\d{3}$/;
    if (!regex.test($('#boxcar-id').value)) {
        boxcarIdError.textContent = 'Boxcar ID must be BX followed by 3 digits';
        boxcarIdError.style.display = 'block';
    } else {
        boxcarIdError.style.display = 'none';
    }
}

function validateTareWeight() {
    if (isNaN($('#tare-weight').value)) {
        tareWeightError.textContent = 'TARE Weight must be a valid number';
        tareWeightError.style.display = 'block';
    } else if (parseFloat($('#tare-weight').value) < 0 || parseFloat($('#tare-weight').value) > 20000) {
        tareWeightError.textContent = 'TARE Weight must be between 0 and 20,000';
        tareWeightError.style.display = 'block';
    } else if (!$('#tare-weight').value) {
        tareWeightError.textContent = 'Please insert a numerical value';
        tareWeightError.style.display = 'block';
    } else {
        tareWeightError.style.display = 'none';
    }
}

function validateMaxGrossWeight() {
    const maxGrossWeightInput = $('#max-gross-weight').value.trim();
    const tareWeightInput = $('#tare-weight').value.trim();
    const maxGrossWeight = parseFloat(maxGrossWeightInput);
    const tareWeight = parseFloat(tareWeightInput);

    if (maxGrossWeightInput === '') {
        // Show error when the input is empty
        maxGrossWeightError.textContent = 'Max Gross Weight cannot be empty';
        maxGrossWeightError.style.display = 'block';
        $('#gross-weight').value = '0';
    } else if (isNaN(maxGrossWeight)) {
        // Show error when input is not a valid number
        maxGrossWeightError.textContent = 'Max Gross Weight must be a valid number';
        maxGrossWeightError.style.display = 'block';
        $('#gross-weight').value = '0';
    } else if (maxGrossWeight < 0 || maxGrossWeight > 200000) {
        // Show error when input is out of the specified range
        maxGrossWeightError.textContent = 'Max Gross Weight must be in range 0 to 200,000';
        maxGrossWeightError.style.display = 'block';
        $('#gross-weight').value = '0';
    } else if (maxGrossWeight <= tareWeight) {
        // Show error when Max Gross Weight is not higher than TARE Weight
        maxGrossWeightError.textContent = 'Max Gross Weight must be higher than TARE Weight';
        maxGrossWeightError.style.display = 'block';
        $('#gross-weight').value = '0';
    } else {
        // Hide error and calculate Gross Weight when all checks pass
        maxGrossWeightError.style.display = 'none';
        if (!isNaN(tareWeight)) {
            $('#gross-weight').value = (parseFloat($('#cargo-weight').value) + tareWeight).toFixed(2);
        } else {
            $('#gross-weight').value = maxGrossWeight.toFixed(2);
        }
    }
}


validateBoxcarId();
validateMaxGrossWeight();
validateTareWeight();

function resetForm() {
    $('#boxcar-id').value = '';
    $('#tare-weight').value = '';
    $('#max-gross-weight').value = '';
    validateMaxGrossWeight();
    validateBoxcarId();
    validateTareWeight();
}

// Event listener setup to wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initially hide all divs except divA
    ['#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none'; // Set display to none
            div.setAttribute('aria-hidden', 'true');
        }
    });

    // Attach change event listeners to radio buttons
    $$('input[type="radio"][name="operation"]').forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });

    // Attach click event listeners to 'Return to Main Page' buttons
    $$('.return-to-main').forEach(button => {
        button.addEventListener('click', handleReturnToMain);
    });

    // Attach input event listeners for validation
    $('#boxcar-id').addEventListener('input', validateBoxcarId);
    $('#tare-weight').addEventListener('input', validateTareWeight);
    $('#max-gross-weight').addEventListener('input', validateMaxGrossWeight);
    $('#reset-form').addEventListener('click', resetForm);
    $('#process-box-car').addEventListener('click', addBoxCar);
    $('#return-to-DivB').addEventListener('click', () => {
        $('#divC').style.display = 'none';
        $('#divB').style.display = 'block';
    });
});

function handleRadioChange() {
    // Hide all divs when a new radio is selected
    ['#divA', '#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
            div.setAttribute('aria-hidden', 'true');
        }
    });

    // Mapping radio buttons to corresponding div IDs
    const divMapping = {
        'create-boxcar': '#divB',
        'add-freight': '#divD',
        'boxcar-data': '#divC',
        'warehouse-data': '#divE',
        'all-freight-status': '#divF',
        'return-to-main': '#divG'
    };

    const selectedDivId = divMapping[this.id];
    if (selectedDivId) {
        const divToShow = $(selectedDivId);
        if (divToShow) {
            divToShow.style.display = 'block';
            divToShow.setAttribute('aria-hidden', 'false');
        } else {
            console.error('No div found for ID:', selectedDivId);
        }
    }
}

function handleReturnToMain() {
    // Hide all specific divs
    ['#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
            div.setAttribute('aria-hidden', 'true');
            resetForm();
        }
    });
    const divA = $('#divA');
    if (divA) {
        divA.style.display = 'block';
        divA.setAttribute('aria-hidden', 'false');
        $$('input[type="radio"][name="operation"]').forEach(radio => {
            radio.checked = false;
        });
    } else {
        console.error('divA not found');
    }
}

function addBoxCar() {
    let errorMessage = 'Please fix:\n';
    errorMessage += boxcarIdError.style.display !== 'none' ? `${boxcarIdError.textContent}\n` : '';
    errorMessage += tareWeightError.style.display !== 'none' ? `${tareWeightError.textContent}\n` : '';
    errorMessage += maxGrossWeightError.style.display !== 'none' ? `${maxGrossWeightError.textContent}\n` : '';

    if (boxcarIdError.style.display !== 'none' || tareWeightError.style.display !== 'none' || maxGrossWeightError.style.display !== 'none') {
        alert(errorMessage.trim());
    } else {
        $('#divC').style.display = 'block';
        createBoxCarTable($('#display-all-boxcars'), $('#boxcar-id'), $('#tare-weight'), $('#max-gross-weight'), $('#cargo-weight'), $('#gross-weight'))
        createFreightListing($('#boxcar-id'));
        resetForm();
    }
}

function createBoxCarTable(table, displayBoxcarID, displayTareWeight, displayMaxGross, displayCargoWeight, displayGrossWeight) {
    const row = document.createElement('tr');

    const boxcarIdCell = document.createElement('td');
    boxcarIdCell.textContent = displayBoxcarID.value;
    row.appendChild(boxcarIdCell);

    const tareWeightCell = document.createElement('td');
    tareWeightCell.textContent = parseFloat(displayTareWeight.value).toFixed(2);
    row.appendChild(tareWeightCell);

    const maxGrossCell = document.createElement('td');
    maxGrossCell.textContent = parseFloat(displayMaxGross.value).toFixed(2);
    row.appendChild(maxGrossCell);

    const cargoWeightCell = document.createElement('td');
    cargoWeightCell.textContent = parseFloat(displayCargoWeight.value).toFixed(2);
    row.appendChild(cargoWeightCell);

    const grossWeightCell = document.createElement('td');
    grossWeightCell.textContent = displayGrossWeight.value;
    row.appendChild(grossWeightCell);

    table.appendChild(row);

    updateTotalWeight(table);
}

function updateTotalWeight(table) {
    const totalWeightCell = $('#total-weight');
    let totalCargoWeight = 0;

    // Calculate total cargo weight by iterating over each row's Cargo Weight column
    $$('tbody tr', table).forEach(row => {  // Adjusted to correctly scope the query within 'table'
        const cargoWeightValue = parseFloat(row.cells[3].textContent);  // Use .textContent for table cells
        if (!isNaN(cargoWeightValue)) {
            totalCargoWeight += cargoWeightValue;
        }
    });

    totalWeightCell.textContent = totalCargoWeight.toFixed(2);  // Update the total cargo weight display
}

function createFreightListing(boxCar) {
    var ul = $('#select-box-car');  // Ensure this is your <ul> element
    var boxCarValue = boxCar.value;  // Get the value from the boxCar input element
    var exists = false;  // Flag to track existence of the value

    // Check if the value already exists in the list
    $$('li button', ul).forEach(function(button) {
        if (button.textContent === boxCarValue) {
            exists = true;  // Set flag to true if the value is found
        }
    });

    // Only add a new list item if the value does not exist
    if (!exists) {
        var li = document.createElement('li');
        var button = document.createElement('button');
        button.textContent = boxCarValue;
        button.type = 'button';
        button.addEventListener('click', function() {
            displayBoxCarFreightInfo(boxCarValue)
        });
        li.appendChild(button);
        ul.appendChild(li);
    }
}

function displayBoxCarFreightInfo(boxCarValue) {
    var existingFreightDiv = $('#freight-info');
    if (existingFreightDiv) {
        existingFreightDiv.remove();
    }

    var freightDiv = document.createElement('div');
    freightDiv.id = 'freight-info';
    freightDiv.className = 'freight-info';

    // Append created inputs and validate
    var boxCarElements = createInputWithLabel('Box Car Selected:', 'selected-boxcar-id', boxCarValue, true);
    var transportIdInput = createInputWithLabel('Transport ID:', 'selected-transport-id');
    var descriptionInput = createInputWithLabel('Description:', 'selected-description');
    var cargoWeightInput = createInputWithLabel('Cargo Weight:', 'selected-cargo-weight');

    // Append elements to freightDiv
    boxCarElements.forEach(element => freightDiv.appendChild(element));
    [transportIdInput, descriptionInput, cargoWeightInput].forEach(elements => {
        elements.forEach(element => freightDiv.appendChild(element));
    });

    $('#box-car-list').appendChild(freightDiv);

    // Attach event listeners
    
    $('#selected-transport-id').addEventListener('input', () => validateTransportId($('#selected-transport-id').value));
    $('#selected-description').addEventListener('input', () => validateDescription($('#selected-description').value));
    $('#selected-cargo-weight').addEventListener('input', () => validateCargoWeight($('#selected-cargo-weight').value));

    // Validate immediately using initial values
    validateTransportId($('#selected-transport-id').value);
    validateDescription($('#selected-description').value);
    validateCargoWeight($('#selected-cargo-weight').value);
}


function validateTransportId(value) {
    const regex = /^BX\d{3}$/;
    const errorSpan = $('#selected-transport-id-error');
    if (!regex.test(value)) {
        errorSpan.textContent = 'Boxcar ID must be BX followed by 3 digits';
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else {
        errorSpan.style.display = 'none';
    }
}

function validateDescription(value) {
    const errorSpan = $('#selected-description-error');
    if (value == '') {
        errorSpan.textContent = 'Description is required for tracking';
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else {
        errorSpan.style.display = 'none';
    }
}

function validateCargoWeight(value) {
    const errorSpan = $('#selected-cargo-weight-error');
    const freightCargoWeightInput = value.trim();  // Direct use of the passed value parameter
    const freightCargoWeight = parseFloat(freightCargoWeightInput);
    const selectedBoxcarId = $('#selected-boxcar-id').value;

    let maxGrossWeight = 0;
    let grossWeight = 0;
    const rows = $$('#display-all-boxcars tr');

    // Calculate total maxGrossWeight and grossWeight for the selected boxcar
    rows.forEach(row => {
        if (row.cells[0].textContent === selectedBoxcarId) {
            maxGrossWeight += parseFloat(row.cells[2].textContent); // Assuming maxGrossWeight is in the 3rd cell
            grossWeight += parseFloat(row.cells[4].textContent); // Assuming grossWeight is in the 5th cell
        }
    });

    const remainingWeight = maxGrossWeight - grossWeight;

    // Update the error messages based on the conditions
    if (freightCargoWeightInput === '') {
        errorSpan.textContent = 'Max Gross Weight cannot be empty';
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else if (isNaN(freightCargoWeight)) {
        errorSpan.textContent = 'Max Gross Weight must be a valid number';
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else if (freightCargoWeight < 0 || freightCargoWeight > remainingWeight) {
        errorSpan.textContent = `Max Gross Weight must be in range 0 to ${remainingWeight.toFixed(2)}`;
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else {
        errorSpan.style.display = 'none';
    }
}



function createInputWithLabel(labelText, inputId, value = '', isDisabled = false) {
    var label = document.createElement('label');
    var input = document.createElement('input');
    var errorSpan = document.createElement('span'); // Create span for errors

    label.textContent = labelText;
    label.htmlFor = inputId;
    input.id = inputId;
    input.value = value;  // Set value if provided
    input.disabled = isDisabled;  // Disable if required

    errorSpan.id = inputId + "-error"; // Set an ID for the span based on the input's ID
    errorSpan.className = "error-message"; // Optional: Add a class for styling the error messages

    // Return an array containing the label, input, and conditionally the errorSpan
    return isDisabled ? [label, input] : [label, input, errorSpan];
}



