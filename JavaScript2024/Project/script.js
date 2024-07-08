const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function createErrorMessage(inputElement) {
    const errorMessage = document.createElement('span');
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
    return errorMessage;
}

const boxcarIdError = createErrorMessage($('#boxcar-id'));
const tareWeightError = createErrorMessage($('#tare-weight'));
const maxGrossWeightError = createErrorMessage($('#max-gross-weight'));

$('#cargo-weight').value = '0';

// Validation functions
function validateBoxcarId() {
    const boxcarIdInput = $('#boxcar-id').value;
    const regex = /^BX\d{3}$/;

    if (!regex.test(boxcarIdInput)) {
        showError(boxcarIdError, 'Boxcar ID must be BX followed by 3 digits');
        return;
    }

    const rows = $$('#display-all-boxcars tr');
    const exists = Array.from(rows).some(row => row.cells[0].textContent === boxcarIdInput);
    if (exists) {
        showError(boxcarIdError, 'This Boxcar ID already exists in the system');
        return;
    }

    hideError(boxcarIdError);
}

function validateTareWeight() {
    const tareWeight = parseFloat($('#tare-weight').value);

    if (isNaN(tareWeight)) {
        showError(tareWeightError, 'TARE Weight must be a valid number');
    } else if (tareWeight < 0 || tareWeight > 20000) {
        showError(tareWeightError, 'TARE Weight must be between 0 and 20,000');
    } else if (!$('#tare-weight').value) {
        showError(tareWeightError, 'Please insert a numerical value');
    } else {
        hideError(tareWeightError);
    }
}

function validateMaxGrossWeight() {
    const maxGrossWeight = parseFloat($('#max-gross-weight').value.trim());
    const tareWeight = parseFloat($('#tare-weight').value.trim());

    if ($('#max-gross-weight').value.trim() === '') {
        showError(maxGrossWeightError, 'Max Gross Weight cannot be empty');
        resetGrossWeight();
    } else if (isNaN(maxGrossWeight)) {
        showError(maxGrossWeightError, 'Max Gross Weight must be a valid number');
        resetGrossWeight();
    } else if (maxGrossWeight < 0 || maxGrossWeight > 200000) {
        showError(maxGrossWeightError, 'Max Gross Weight must be in range 0 to 200,000');
        resetGrossWeight();
    } else if (maxGrossWeight <= tareWeight) {
        showError(maxGrossWeightError, 'Max Gross Weight must be higher than TARE Weight');
        resetGrossWeight();
    } else {
        hideError(maxGrossWeightError);
        calculateGrossWeight(maxGrossWeight, tareWeight);
    }
}

function resetGrossWeight() {
    $('#gross-weight').value = '0';
}

function calculateGrossWeight(maxGrossWeight, tareWeight) {
    if (!isNaN(tareWeight)) {
        $('#gross-weight').value = (parseFloat($('#cargo-weight').value) + tareWeight).toFixed(2);
    } else {
        $('#gross-weight').value = maxGrossWeight.toFixed(2);
    }
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(errorElement) {
    errorElement.style.display = 'none';
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


document.addEventListener('DOMContentLoaded', function() {
    // Initially hide all divs except divA and divE
    ['#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
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
    $('#return-to-divD').addEventListener('click', () => {
        $('#divF').style.display = 'none';
        $('#divE').style.display = 'none';
        $('#divD').style.display = 'block';
    });
    $('#process-freight').addEventListener('click', processFreight);
    $('#reset-freight').addEventListener('click', resetFreightForm);
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
        'warehouse-data': '#divF',
        'all-freight-status': '#divG',
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
        $$('input[type="radio"][name="operation"]').forEach(radio => radio.checked = false);
    } else {
        console.error('divA not found');
    }
    resetFreightForm()
}


function addBoxCar() {
    const errors = [
        { element: boxcarIdError, message: boxcarIdError.textContent },
        { element: tareWeightError, message: tareWeightError.textContent },
        { element: maxGrossWeightError, message: maxGrossWeightError.textContent }
    ];

    const errorMessage = errors
        .filter(error => error.element.style.display !== 'none')
        .map(error => error.message)
        .join('\n');

    if (errorMessage) {
        alert(`Please fix:\n${errorMessage}`);
    } else {
        $('#divC').style.display = 'block';
        createBoxCarTable($('#display-all-boxcars'), $('#boxcar-id'), $('#tare-weight'), $('#max-gross-weight'), $('#cargo-weight'), $('#gross-weight'));
        createFreightListing($('#boxcar-id'));
        resetForm();
    }
}


function createBoxCarTable(table, displayBoxcarID, displayTareWeight, displayMaxGross, displayCargoWeight, displayGrossWeight) {
    const row = document.createElement('tr');

    const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));

    const cells = [
        displayBoxcarID.value,
        parseFloat(displayTareWeight.value).toFixed(2),
        parseFloat(displayMaxGross.value).toFixed(2),
        parseFloat(displayCargoWeight.value).toFixed(2),
        displayGrossWeight.value
    ];

    cells.forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });

    tbody.appendChild(row);
    updateTotalWeight(table);
}


function updateTotalWeight(table) {
    const totalWeightCell = $('#total-weight');
    let totalCargoWeight = 0;

    const rows = table.querySelectorAll('tbody tr');

    // Calculate total cargo weight by iterating over each row's Cargo Weight column
    rows.forEach(row => {
        const cargoWeightValue = parseFloat(row.cells[4].textContent);  // Use .textContent for table cells
        if (!isNaN(cargoWeightValue)) {
            totalCargoWeight += cargoWeightValue;
        }
    });

    totalWeightCell.textContent = totalCargoWeight.toFixed(2);  // Update the total cargo weight display
}


function createFreightListing(boxCar) {
    const ul = $('#select-box-car');  // Ensure this is your <ul> element
    const boxCarValue = boxCar.value;  // Get the value from the boxCar input element

    // Check if the value already exists in the list
    const exists = Array.from(ul.querySelectorAll('li button')).some(button => button.textContent === boxCarValue);

    // Only add a new list item if the value does not exist
    if (!exists) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = boxCarValue;
        button.type = 'button';
        button.addEventListener('click', () => {
            disableButtonList(ul);
            displayBoxCarFreightInfo(boxCarValue);
        });
        li.appendChild(button);
        ul.appendChild(li);
    }
}


function disableButtonList(ul) {
    const buttons = ul.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}


function displayBoxCarFreightInfo(boxCarValue) {
    // Set the value of the selected boxcar input field
    $('#divE').style.display = 'none';
    $('#selected-boxcar-id').value = boxCarValue;

    // Enable the input fields and buttons
    ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
        $(id).disabled = false;
    });

    // Attach event listeners for validation
    $('#selected-transport-id').addEventListener('input', () => validateTransportId($('#selected-transport-id').value));
    $('#selected-description').addEventListener('input', () => validateDescription($('#selected-description').value));
    $('#selected-cargo-weight').addEventListener('input', () => validateCargoWeight($('#selected-cargo-weight').value));

    // Validate immediately using initial values
    validateTransportId($('#selected-transport-id').value);
    validateDescription($('#selected-description').value);
    validateCargoWeight($('#selected-cargo-weight').value);
}

function validateTransportId(value) {
    const regex = /^[A-Z]{3}\d{5}$/;
    const errorSpan = $('#selected-transport-id-error');
    toggleError(errorSpan, regex.test(value), 'Transport ID must be 3 capital letters followed by 5 digits');
}

function validateDescription(value) {
    const errorSpan = $('#selected-description-error');
    toggleError(errorSpan, value !== '', 'Description is required for tracking');
}




function validateCargoWeight(value) {
    const errorSpan = $('#selected-cargo-weight-error');

    const freightCargoWeight = parseFloat(value.trim());
    const selectedBoxcarId = $('#selected-boxcar-id').value;

    let maxGrossWeight = 0;
    let grossWeight = 0;

    // Retrieve max gross weight and gross weight from the display table
    const boxcarRows = $$('#display-all-boxcars tr');
    boxcarRows.forEach(row => {
        if (row.cells[0].textContent === selectedBoxcarId) {
            maxGrossWeight = parseFloat(row.cells[2].textContent); // Assuming maxGrossWeight is in the 3rd cell
            grossWeight = parseFloat(row.cells[4].textContent); // Assuming grossWeight is in the 5th cell
        }
    });

    let errorMessage = '';
    if (isNaN(freightCargoWeight) || value == '' || isNaN(value)) {
        errorMessage = 'Cargo Weight must be a valid number';
    } else if (freightCargoWeight <= 0) {
        errorMessage = 'Cargo Weight must be greater than 0';
    } else if (freightCargoWeight > (maxGrossWeight - grossWeight)) {
        errorMessage = `Cargo Weight exceeds the maximum gross weight of ${maxGrossWeight.toFixed(2)-grossWeight.toFixed(2)} for this car.`; 
    }

    toggleError(errorSpan, !errorMessage, errorMessage);
}

function toggleError(errorSpan, condition, message) {
    if (!condition) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
        errorSpan.style.color = 'red';
    } else {
        errorSpan.style.display = 'none';
    }
}


function resetFreightForm(resetBoxcarId = true) {
    const buttons = $('#select-box-car').querySelectorAll('button');
    if (resetBoxcarId) {
        ['#selected-boxcar-id', '#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
            $(id).value = '';
        });
        buttons.forEach(button => {
            button.disabled = false;
        });
        ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
            $(id).disabled = true;
        });
    } else {
        ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
            $(id).value = '';
        });
    }

    ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
        const validateFunction = {
            '#selected-transport-id': validateTransportId,
            '#selected-description': validateDescription,
            '#selected-cargo-weight': validateCargoWeight
        }[id];
        validateFunction($(id).value);
    });

    
    $('#divD .return-to-main').style.display = 'block';
    $('#divE').style.display = 'none';
}



function processFreight() {
    const errorMessages = ['#selected-transport-id-error', '#selected-description-error', '#selected-cargo-weight-error']
        .filter(id => $(id).style.display !== 'none')
        .map(id => $(id).textContent)
        .join('\n');

    if (errorMessages) {
        alert(`Please fix:\n${errorMessages}`);
    } else {
        const selectedBoxcarId = $('#selected-boxcar-id').value;
        const cargoWeight = parseFloat($('#selected-cargo-weight').value.trim());

        let maxGrossWeight = 0;
        let grossWeight = 0;

        // Retrieve max gross weight and gross weight from the display table
        const boxcarRows = $$('#display-all-boxcars tr');
        boxcarRows.forEach(row => {
            if (row.cells[0].textContent === selectedBoxcarId) {
                maxGrossWeight = parseFloat(row.cells[2].textContent); // Assuming maxGrossWeight is in the 3rd cell
                grossWeight = parseFloat(row.cells[4].textContent); // Assuming grossWeight is in the 5th cell
            }
        });

        // Calculate total loaded weight from both the current manifest and the all-freight-table
        const manifestTitle = $('#boxcar-manifest-title');
        const totalLoadedWeightManifest = manifestTitle && manifestTitle.textContent.includes(selectedBoxcarId)
            ? Array.from($$('#boxcar-manifest tbody tr')).reduce((total, row) => {
                const cellValue = parseFloat(row.cells[2]?.textContent || 0);
                return total + (!isNaN(cellValue) ? cellValue : 0);
            }, 0)
            : 0;

        const totalLoadedWeightAllFreight = Array.from($$('#all-freight-table tbody tr')).reduce((total, row) => {
            if (row.cells[3]?.textContent === selectedBoxcarId) {
                const cellValue = parseFloat(row.cells[2]?.textContent || 0);
                return total + (!isNaN(cellValue) ? cellValue : 0);
            }
            return total;
        }, 0);

        const totalLoadedWeight = totalLoadedWeightManifest + totalLoadedWeightAllFreight;
        const remainingWeight = maxGrossWeight - grossWeight - totalLoadedWeight;

        if (cargoWeight > remainingWeight) {
            alert(`The cargo weight exceeds the remaining weight for this boxcar. Remaining weight: ${remainingWeight.toFixed(2)}\n
            Sending cargo to warehouse`);
            createFreightTable('Warehouse', $('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            createWarehouseTable($('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            resetFreightForm(false); // Ensure the selected boxcar ID is retained
            populateBoxcarManifest(selectedBoxcarId);
            $('#divE').style.display = 'block';
            $('#divD .return-to-main').style.display = 'none';

            // Re-validate the fields to clear error messages
            ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
                const validateFunction = {
                    '#selected-transport-id': validateTransportId,
                    '#selected-description': validateDescription,
                    '#selected-cargo-weight': validateCargoWeight
                }[id];
                validateFunction($(id).value);
            });
        } else {
            createFreightTable($('#selected-boxcar-id').value, $('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            resetFreightForm(false); // Ensure the selected boxcar ID is retained
            populateBoxcarManifest(selectedBoxcarId);
            $('#divE').style.display = 'block';
            $('#divD .return-to-main').style.display = 'none';

            // Re-validate the fields to clear error messages
            ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
                const validateFunction = {
                    '#selected-transport-id': validateTransportId,
                    '#selected-description': validateDescription,
                    '#selected-cargo-weight': validateCargoWeight
                }[id];
                validateFunction($(id).value);
            });
        }
    }
}



function populateBoxcarManifest(boxcarId) {
    const manifestTable = $('#boxcar-manifest tbody');
    const allFreightRows = Array.from($('#freight-table-body').querySelectorAll('tr'));

    // Clear the existing manifest table
    manifestTable.innerHTML = '';

    allFreightRows.forEach(row => {
        if (row.cells[3]?.textContent === boxcarId) { // Assuming 'Status' is the 4th cell
            const manifestRow = document.createElement('tr');

            const transportIdCell = document.createElement('td');
            transportIdCell.textContent = row.cells[0].textContent; // Transport ID
            manifestRow.appendChild(transportIdCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = row.cells[1].textContent; // Description
            manifestRow.appendChild(descriptionCell);

            const weightCell = document.createElement('td');
            weightCell.textContent = row.cells[2].textContent; // Weight
            manifestRow.appendChild(weightCell);

            manifestTable.appendChild(manifestRow);
        }
    });

    // Update the total cargo weight in the manifest table footer
    updateTotalFreightWeight();
}

function createFreightTable(freightBoxcarId, freightTransportId, freightDescription, freightCargoWeight) {
    const tbody = $('#freight-table-body');

    // Create a new row and populate it
    const row = document.createElement('tr');
    const cells = [
        freightTransportId.value,
        freightDescription.value,
        parseFloat(freightCargoWeight.value).toFixed(2),
        freightBoxcarId
    ];

    cells.forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });

    // Append the row to tbody
    tbody.appendChild(row);

    // Update the total cargo weight in the footer
    updateTotalFreightWeight();
}

function updateTotalFreightWeight() {
    const totalFreightWeightCell = $('#total-freight-weight');
    const totalCargoWeightCell = $('#total-cargo-weight');
    if (!totalFreightWeightCell) {
        console.error("Total freight weight element not found");
        return;
    }
    if (!totalCargoWeightCell) {
        console.error("Total cargo weight element not found");
        return;
    }
    let totalCargoWeight = 0;
    let totalFreightWeight = 0;
    const rows = $('#boxcar-manifest tbody').querySelectorAll('tr');
    const cargoRows = $('#freight-table-body').querySelectorAll('tr')

    rows.forEach(row => {
        const freightWeightValue = parseFloat(row.cells[2]?.textContent || 0);
        if (!isNaN(freightWeightValue)) {
            totalFreightWeight += freightWeightValue;
        }
    });

    cargoRows.forEach(row => {
        const cargoWeightValue = parseFloat(row.cells[2]?.textContent || 0);
        if (!isNaN(cargoWeightValue)) {
            totalCargoWeight += cargoWeightValue;
        }
    });

    totalFreightWeightCell.textContent = totalFreightWeight.toFixed(2);
    totalCargoWeightCell.textContent = totalCargoWeight.toFixed(2);
}

function createWarehouseTable(freightTransportId, freightDescription, freightCargoWeight) {
    const tbody = $('#warehouse-manifest tbody');
    // Create a new row and populate it
    const row = document.createElement('tr');
    const cells = [
        freightTransportId.value,
        freightDescription.value,
        parseFloat(freightCargoWeight.value).toFixed(2),
    ];

    cells.forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });

    // Append the row to tbody
    tbody.appendChild(row);

    updateTotalWarehouseWeight();
}

function updateTotalWarehouseWeight() {
    const totalWarehouseWeightCell = $('#total-warehouse-weight');
    if (!totalWarehouseWeightCell) {
        console.error("Total Warehouse weight element not found");
        return;
    }
    let totalWarehouseWeight = 0;
    const rows = $('#warehouse-manifest tbody').querySelectorAll('tr');

    rows.forEach(row => {
        const warehouseWeightValue = parseFloat(row.cells[2]?.textContent || 0);
        if (!isNaN(warehouseWeightValue)) {
            totalWarehouseWeight += warehouseWeightValue;
        }
    });

    totalWarehouseWeightCell.textContent = totalWarehouseWeight.toFixed(2);
}
