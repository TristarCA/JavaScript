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
const exceedsMaxWeight = createErrorMessage($('#selected-cargo-weight'));

let boxcars = [];
function Boxcar(id, tareWeight, maxGrossWeight, cargoWeight, grossWeight) {
    this.id = id;
    this.tareWeight = parseFloat(tareWeight);
    this.maxGrossWeight = parseFloat(maxGrossWeight);
    this.cargoWeight = parseFloat(cargoWeight);
    this.grossWeight = parseFloat(grossWeight);
}

let freights = [];
function Freight(transportId, description, cargoWeight, boxcarId) {
    this.transportId = transportId;
    this.description = description;
    this.cargoWeight = parseFloat(cargoWeight);
    this.boxcarId = boxcarId;
}

let warehouses = [];
function Warehouse(transportId, description, cargoWeight) {
    this.transportId = transportId;
    this.description = description;
    this.cargoWeight = parseFloat(cargoWeight);
}

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

function resetForm() {
    $('#boxcar-id').value = '';
    $('#tare-weight').value = '';
    $('#max-gross-weight').value = '';
    validateMaxGrossWeight();
    validateBoxcarId();
    validateTareWeight();
    resetAnimation();
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
        $('#divB .return-to-main').style.display = 'block';
        resetAnimation();
    });
    $('#divC .return-to-main').addEventListener('click', () => {
        $('#divB .return-to-main').style.display = 'block';
    })
    $$('.return-to-divD').forEach(button => {
        button.addEventListener('click', handleReturnToDivD)
    });
    $('#process-freight').addEventListener('click', processFreight);
    $('#reset-freight').addEventListener('click', resetFreightForm);
    $('#selected-transport-id').addEventListener('input', validateTransportId);
    $('#selected-description').addEventListener('input', validateDescription);
    $('#selected-cargo-weight').addEventListener('input', validateCargoWeight);
    $('#advance-day').addEventListener('click', advanceDay);
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
            resetAnimation();
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
        const newBoxcar = new Boxcar(
            $('#boxcar-id').value,
            $('#tare-weight').value,
            $('#max-gross-weight').value,
            $('#cargo-weight').value,
            $('#gross-weight').value
        );

        boxcars.push(newBoxcar);

        createBoxCarTable(newBoxcar);

        $('#divC').style.display = 'block';
        createFreightListing(newBoxcar.id);
        resetForm();
        $('#divB .return-to-main').style.display = 'none';
        myMove()
    }
}

function createBoxCarTable() {
    const table = $('#display-all-boxcars');
    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = table.appendChild(document.createElement('tbody'));
    } else {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

    boxcars.forEach(boxcar => {
        const row = document.createElement('tr');
        const values = [boxcar.id, boxcar.tareWeight, boxcar.maxGrossWeight, boxcar.cargoWeight, boxcar.grossWeight];
        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = typeof value === 'number' ? value.toFixed(2) : value;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    updateTotalWeight();
}

function updateTotalWeight() {
    const totalWeightCell = $('#total-weight');
    let totalCargoWeight = boxcars.reduce((sum, boxcar) => sum + parseFloat(boxcar.cargoWeight), 0);
    totalWeightCell.textContent = totalCargoWeight.toFixed(2);
}

function createFreightListing() {
    const ul = $('#select-box-car');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    boxcars.forEach(boxcar => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = boxcar.id;
        button.type = 'button';
        
        button.addEventListener('click', () => {
            disableButtonList(ul);
            displayBoxCarFreightInfo(boxcar.id);
        });
        
        li.appendChild(button);
        ul.appendChild(li);
    });
}

function disableButtonList(ul) {
    const buttons = ul.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.backgroundColor = 'red';
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
    let tareWeight = 0;

    const boxcarRows = $$('#display-all-boxcars tr');
    boxcarRows.forEach(row => {
        if (row.cells[0].textContent === selectedBoxcarId) {
            maxGrossWeight = parseFloat(row.cells[2].textContent);
            tareWeight = parseFloat(row.cells[1].textContent);
        }
    });

    if (isNaN(freightCargoWeight) || cargoWeightInput == '' || isNaN(cargoWeightInput)) {
        showError(selectedCargoWeightError, 'Cargo Weight must be a valid number');
    } else if (freightCargoWeight <= 0) {
        showError(selectedCargoWeightError, 'Cargo Weight must be greater than 0');
    } else if (freightCargoWeight > (maxGrossWeight - tareWeight)) {
        showError(selectedCargoWeightError, `Cargo Weight exceeds the maximum gross weight of ${maxGrossWeight.toFixed(2)- tareWeight.toFixed(2)} for this car.`);
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
            button.style.backgroundColor = '#5c67f2'
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
    $('#divF').style.display = 'none';

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
        console.error(errorMessage);
        return;
    } else {
        const selectedBoxcarId = $('#selected-boxcar-id').value;
        const cargoWeight = parseFloat($('#selected-cargo-weight').value.trim());
        let maxGrossWeight = 0, grossWeight = 0, tareWeight = 0;

        boxcars.forEach(boxcar => {
            if (boxcar.id === selectedBoxcarId) {
                maxGrossWeight = boxcar.maxGrossWeight;
                grossWeight = boxcar.grossWeight;
                tareWeight = boxcar.tareWeight;
            }
        });

        // Calculate the total loaded weight for the selected boxcar ID
        const totalLoadedWeight = freights.reduce((total, freight) => {
            return freight.boxcarId === selectedBoxcarId ? total + freight.cargoWeight : total;
        }, 0);

        const remainingWeight = maxGrossWeight - totalLoadedWeight - tareWeight;

        if (cargoWeight > remainingWeight) {
            const freight = new Freight($('#selected-transport-id').value, $('#selected-description').value, cargoWeight, 'Warehouse');
            const warehouse = new Warehouse($('#selected-transport-id').value, $('#selected-description').value, cargoWeight);
            resetFreightForm(false);
            freights.push(freight);
            warehouses.push(warehouse);
            createFreightTable(freights);
            createWarehouseTable(warehouses);
            $('#divF').style.display = 'block';
            showError(exceedsMaxWeight, `Previous cargo Diverted to Warehouse-weight exceeded remaining ${remainingWeight}lbs of ${selectedBoxcarId}`)

        } else {
            const freight = new Freight($('#selected-transport-id').value, $('#selected-description').value, cargoWeight, selectedBoxcarId);
            boxcars.forEach(boxcar => {
                if (boxcar.id === selectedBoxcarId) {
                    boxcar.cargoWeight += cargoWeight;
                    grossWeight = tareWeight + boxcar.cargoWeight;
                }
                resetFreightForm(false);
            });
            createBoxCarTable();
            
            freights.push(freight);
            createFreightTable(freights);
        }

        
        populateBoxcarManifest(selectedBoxcarId);
        $('#divE').style.display = 'block';
        $('#divD .return-to-main').style.display = 'none';

        validateTransportId();
        validateDescription();
        validateCargoWeight();
    }
}


function calculateTotalLoadedWeight(boxcarId) {
    return boxcars.reduce((total, boxcar) => {
        return boxcar.id === boxcarId ? total + boxcar.cargoWeight : total;
    }, 0);
}


function populateBoxcarManifest(boxcarId) {
    const manifestTable = document.querySelector('#boxcar-manifest tbody');
    const manifestContainer = document.querySelector('#boxcar-manifest');

    let titleElement = document.querySelector('#manifest-title');
    if (!titleElement) {
        titleElement = document.createElement('h2');
        titleElement.id = 'manifest-title';
        manifestContainer.parentNode.insertBefore(titleElement, manifestContainer);
    }
    titleElement.textContent = `CNA - Box Car ${boxcarId} Manifest`;

    while (manifestTable.firstChild) {
        manifestTable.removeChild(manifestTable.firstChild);
    }

    freights.filter(freight => freight.boxcarId === boxcarId).forEach(freight => {
        const row = document.createElement('tr');

        const transportIdCell = document.createElement('td');
        transportIdCell.textContent = freight.transportId;
        row.appendChild(transportIdCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = freight.description;
        row.appendChild(descriptionCell);

        const weightCell = document.createElement('td');
        weightCell.textContent = freight.cargoWeight.toFixed(2);
        row.appendChild(weightCell);

        manifestTable.appendChild(row);
    });
}

function createFreightTable(freights) {
    const tbody = $('#all-freight-table tbody');
    const titleElement = $('#freight-table-title');

    const selectedBoxcarId = $('#selected-boxcar-id').value;
    if (titleElement) {
        titleElement.textContent = `CNA - Box Car ${selectedBoxcarId} Manifest`;
    }

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    freights.forEach(freight => {
        const row = document.createElement('tr');
        const values = [
            freight.transportId,
            freight.description,
            freight.cargoWeight.toFixed(2),
            freight.boxcarId
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    updateTotalFreightWeight();
}

function updateTotalFreightWeight() {
    const totalFreightWeightCell = $('#total-freight-weight');
    const totalCargoWeightCell = $('#total-cargo-weight');
    const selectedBoxcarId = $('#selected-boxcar-id').value;

    let totalFreightWeight = freights.reduce((total, freight) => {
        return  total + freight.cargoWeight;
    }, 0);

    let totalCargoWeight = freights.reduce((total, freight) => {
        return freight.boxcarId === selectedBoxcarId && freight.cargoWeight !== 0 ? total + freight.cargoWeight : total;
    }, 0);

    totalCargoWeightCell.textContent = totalCargoWeight.toFixed(2);
    totalFreightWeightCell.textContent = totalFreightWeight.toFixed(2);
}



function createWarehouseTable(warehouses) {
    const tbody = $('#warehouse-manifest tbody');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    warehouses.forEach(warehouse => {
        const row = document.createElement('tr');
        const values = [
            warehouse.transportId,
            warehouse.description,
            warehouse.cargoWeight.toFixed(2),
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    updateTotalWarehouseWeight();
}


function updateTotalWarehouseWeight() {
    const totalWarehouseWeightCell = $('#total-warehouse-weight');
    if (!totalWarehouseWeightCell) {
        console.error("Total Warehouse weight element not found");
        return;
    }

    let totalWarehouseWeight = warehouses.reduce((total, warehouse) => total + warehouse.cargoWeight, 0);
    totalWarehouseWeightCell.textContent = totalWarehouseWeight.toFixed(2);
    $('#divF').style.display = 'block';
}

function advanceDay() {
    var dayValue = parseInt($('#day-counter').value); 
    dayValue += 1;
    $('#day-counter').value = dayValue
}


// ----------------------------------Something for fun------------------------------------------------ //
var id = null;
function myMove() {
    var elem = $('#myAnimation');   
    var pos = 0;
    elem.style.backgroundColor = 'red';
    elem.textContent = '';
    clearInterval(id);
    id = setInterval(frame, 5);
    function frame() {
    if (pos == 500) {
        clearInterval(id);
        elem.style.backgroundColor = '#1dd605';
        elem.textContent = 'Success!';
    } else {
        pos++;
        elem.style.left = pos + 'px'; 
        }
    }
}

function resetAnimation() {
    var elem = $('#myAnimation');   
    var pos = 0;
    elem.style.backgroundColor = 'red';
    elem.textContent = '';
    elem.style.left = pos + 'px';
    clearInterval(id);
}

// ----------------------------------Something for fun------------------------------------------------ //