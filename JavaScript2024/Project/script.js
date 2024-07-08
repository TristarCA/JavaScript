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
const selectedBoxcarIdError = createErrorMessage($('#selected-boxcar-id'));
const selectedTransportIdError = createErrorMessage($('#selected-transport-id'));
const selectedDescriptionError = createErrorMessage($('#selected-description'));
const selectedCargoWeightError = createErrorMessage($('#selected-cargo-weight'));

$('#cargo-weight').value = '0';

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
        $('#gross-weight').value = '0';
    } else if (isNaN(maxGrossWeight)) {
        showError(maxGrossWeightError, 'Max Gross Weight must be a valid number');
        $('#gross-weight').value = '0';
    } else if (maxGrossWeight < 0 || maxGrossWeight > 200000) {
        showError(maxGrossWeightError, 'Max Gross Weight must be in range 0 to 200,000');
        $('#gross-weight').value = '0';
    } else if (maxGrossWeight <= tareWeight) {
        showError(maxGrossWeightError, 'Max Gross Weight must be higher than TARE Weight');
        $('#gross-weight').value = '0';
    } else {
        hideError(maxGrossWeightError);
        calculateGrossWeight(maxGrossWeight, tareWeight);
    }
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

/* TEST TO ENSURE JUST USING resetForm IS ACTUALLY WORKING ON PAGE LOAD
    validateMaxGrossWeight();
    validateBoxcarId();
    validateTareWeight(); */

function resetForm() {
    $('#boxcar-id').value = '';
    $('#tare-weight').value = '';
    $('#max-gross-weight').value = '';
    validateMaxGrossWeight();
    validateBoxcarId();
    validateTareWeight();
}

resetForm();

document.addEventListener('DOMContentLoaded', function() {
    ['#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
        }
    });

    $$('.radio').forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });

    $$('.return-to-main').forEach(button => {
        button.addEventListener('click', handleReturnToMain);
    });

    $('#boxcar-id').addEventListener('input', validateBoxcarId);
    $('#tare-weight').addEventListener('input', validateTareWeight);
    $('#max-gross-weight').addEventListener('input', validateMaxGrossWeight);
    $('#reset-form').addEventListener('click', resetForm);
    $('#process-box-car').addEventListener('click', addBoxCar);
    $('#return-to-DivB').addEventListener('click', () => {
        $('#divC').style.display = 'none';
        $('#divB').style.display = 'block';
    });
    $$('.return-to-divD').forEach(button => {
        button.addEventListener('click', handleReturnToDivD)
    });
    $('#process-freight').addEventListener('click', processFreight);
    $('#reset-freight').addEventListener('click', resetFreightForm);
    $('#selected-transport-id').addEventListener('input', validateTransportId);
    $('#selected-description').addEventListener('input', validateDescription);
    $('#selected-cargo-weight').addEventListener('input', validateCargoWeight);
});

function handleRadioChange() {
    ['#divA', '#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
            div.setAttribute('aria-hidden', 'true');
        }
    });

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

function handleReturnToDivD() {
    const divD = $('#divD');
    if (divD) {
        divD.style.display = 'block';
        $('#divE').style.display = 'none';
        $('#divF').style.display = 'none';
        $('#divD .return-to-main').style.display = 'block';
    }
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
        return;
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

    rows.forEach(row => {
        const cargoWeightValue = parseFloat(row.cells[4].textContent); 
        if (!isNaN(cargoWeightValue)) {
            totalCargoWeight += cargoWeightValue;
        }
    });

    totalWeightCell.textContent = totalCargoWeight.toFixed(2); 
}

function createFreightListing(boxCar) {
    const ul = $('#select-box-car');
    const boxCarValue = boxCar.value;

    const exists = Array.from(ul.querySelectorAll('li button')).some(button => button.textContent === boxCarValue);

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
    $('#divE').style.display = 'none';
    $('#selected-boxcar-id').value = boxCarValue;

    ['#selected-transport-id', '#selected-description', '#selected-cargo-weight'].forEach(id => {
        $(id).disabled = false;
    });
}

function validateTransportId() {
    const transportIdInput = ($('#selected-transport-id').value);
    const regex = /^[A-Z]{3}\d{4}S0[1-4]$/;
    if (!regex.test(transportIdInput)) {
        showError(selectedTransportIdError, 'Transport ID must be 3 capital letters followed by 4 digit, an S and [01-04])\n EX.TXL2031S02');
    } else {
        hideError(selectedTransportIdError);
    }
}

function validateDescription() {
    const descriptionInput = ($('#selected-description').value);
    if (descriptionInput == '') {
        showError(selectedDescriptionError, 'Description is required for tracking');
    } else {
        hideError(selectedDescriptionError);
    }
}

function validateCargoWeight() {
    const cargoWeightInput = ($('#selected-cargo-weight').value)
    const freightCargoWeight = parseFloat(cargoWeightInput.trim());
    const selectedBoxcarId = $('#selected-boxcar-id').value;

    let maxGrossWeight = 0;
    let grossWeight = 0;

    const boxcarRows = $$('#display-all-boxcars tr');
    boxcarRows.forEach(row => {
        if (row.cells[0].textContent === selectedBoxcarId) {
            maxGrossWeight = parseFloat(row.cells[2].textContent);
            grossWeight = parseFloat(row.cells[4].textContent);
        }
    });

    if (isNaN(freightCargoWeight) || cargoWeightInput == '' || isNaN(cargoWeightInput)) {
        showError(selectedCargoWeightError, 'Cargo Weight must be a valid number');
    } else if (freightCargoWeight <= 0) {
        showError(selectedCargoWeightError, 'Cargo Weight must be greater than 0');
    } else if (freightCargoWeight > (maxGrossWeight - grossWeight)) {
        showError(selectedCargoWeightError, `Cargo Weight exceeds the maximum gross weight of ${maxGrossWeight.toFixed(2)-grossWeight.toFixed(2)} for this car.`);
    } else {
        hideError(selectedCargoWeightError);
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
    validateTransportId();
    validateDescription();
    validateCargoWeight();

    
    $('#divD .return-to-main').style.display = 'block';
    $('#divE').style.display = 'none';
}

function processFreight() {
    const errors = [
        { element: selectedTransportIdError, message: selectedTransportIdError.textContent },
        { element: selectedDescriptionError, message: selectedDescriptionError.textContent },
        { element: selectedCargoWeightError, message: selectedCargoWeightError.textContent }
    ];
    
    const errorMessage = errors
        .filter(error => error.element.style.display !== 'none')
        .map(error => error.message)
        .join('\n');

    if (errorMessage) {
        return;
    } else {
        const selectedBoxcarId = $('#selected-boxcar-id').value;
        const cargoWeight = parseFloat($('#selected-cargo-weight').value.trim());

        let maxGrossWeight = 0;
        let grossWeight = 0;

        const boxcarRows = $$('#display-all-boxcars tr');
        boxcarRows.forEach(row => {
            if (row.cells[0].textContent === selectedBoxcarId) {
                maxGrossWeight = parseFloat(row.cells[2].textContent);
                grossWeight = parseFloat(row.cells[4].textContent);
            }
        });

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
            createFreightTable('Warehouse', $('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            createWarehouseTable($('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            resetFreightForm(false);
            populateBoxcarManifest(selectedBoxcarId);
            $('#divE').style.display = 'block';
            $('#divD .return-to-main').style.display = 'none';
            $('#divE .return-to-main').style.display = 'none';
            $('#divE .return-to-divD').style.display = 'none';

            validateTransportId();
            validateDescription();
            validateCargoWeight();
        } else {
            createFreightTable($('#selected-boxcar-id').value, $('#selected-transport-id'), $('#selected-description'), $('#selected-cargo-weight'));
            resetFreightForm(false);
            populateBoxcarManifest(selectedBoxcarId);
            $('#divE').style.display = 'block';
            $('#divD .return-to-main').style.display = 'none';

            validateTransportId();
            validateDescription();
            validateCargoWeight();
        }
    }
}

function populateBoxcarManifest(boxcarId) {
    const manifestTable = $('#boxcar-manifest tbody');
    const allFreightRows = Array.from($('#all-freight-table').querySelectorAll('tr'));

    manifestTable.innerHTML = '';

    allFreightRows.forEach(row => {
        if (row.cells[3]?.textContent === boxcarId) {
            const manifestRow = document.createElement('tr');

            const transportIdCell = document.createElement('td');
            transportIdCell.textContent = row.cells[0].textContent;
            manifestRow.appendChild(transportIdCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = row.cells[1].textContent; 
            manifestRow.appendChild(descriptionCell);

            const weightCell = document.createElement('td');
            weightCell.textContent = row.cells[2].textContent;
            manifestRow.appendChild(weightCell);

            manifestTable.appendChild(manifestRow);
        }
    });

    updateTotalFreightWeight();
}

function createFreightTable(freightBoxcarId, freightTransportId, freightDescription, freightCargoWeight) {
    const tbody = $('#all-freight-table tbody');

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

    tbody.appendChild(row);

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
    $('#divF').style.display = 'block';
}
