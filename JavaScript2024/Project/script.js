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
function Boxcar(id, tareWeight, maxGrossWeight, cargoWeight) {
    this.id = id;
    this.tareWeight = parseFloat(tareWeight);
    this.maxGrossWeight = parseFloat(maxGrossWeight);
    this.cargoWeight = parseFloat(cargoWeight);
    this.grossWeight = this.tareWeight + this.cargoWeight;
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
    let exists = false;
    for (let row of rows) {
        if (row.cells[0].textContent === boxcarIdInput) {
            exists = true;
            break;
        }
    }

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
        $(id).style.display = 'none';
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
    $('#selected-cargo-weight').addEventListener('focus', () => {
        hideError(exceedsMaxWeight);
    });
    $('#system-summary').addEventListener('click', function() {
        if (this.checked) {
            var form = document.createElement('form');
            form.method = 'GET';
            form.action = 'summary.html';
            document.body.appendChild(form);
            form.submit();
        }
    })
});

function hideError(errorElement) {
    errorElement.style.display = 'none';
}

function handleRadioChange() {
    ['#divA', '#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        $(id).style.display = 'none';
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
    $(selectedDivId).style.display = 'block';
        
}

function handleReturnToMain() {
    ['#divB', '#divC', '#divD', '#divE', '#divF', '#divG'].forEach(id => {
        const div = $(id);
        if (div) {
            div.style.display = 'none';
            resetForm();
            resetAnimation();
        }
    });
    
    const divA = $('#divA');
    if (divA) {
        divA.style.display = 'block';
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
    if (boxcarIdError.style.display !== 'none' ||
        maxGrossWeightError.style.display !== 'none' ||
        tareWeightError.style.display !== 'none') {
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
    setCookie('totalWeightInBoxcars', totalCargoWeight.toFixed(2), 1);
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
    const exists = freights.some(freight => freight.transportId === transportIdInput);
    if (!regex.test(transportIdInput)) {
        showError(selectedTransportIdError, 'Transport ID must be 3 capital letters followed by 4 digit, an S and [01-04])\n EX.TXL2031S02');
    } else if (exists) {
        showError(selectedTransportIdError, 'This Transport ID already exists in the system');
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
    if (selectedTransportIdError.style.display !== 'none' ||
        selectedDescriptionError.style.display !== 'none' ||
        selectedCargoWeightError.style.display !== 'none') {
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

        const totalLoadedWeight = freights.reduce((total, freight) => {
            return freight.boxcarId === selectedBoxcarId ? total + freight.cargoWeight : total;
        }, 0);

        const remainingWeight = maxGrossWeight - totalLoadedWeight - tareWeight;

        if (cargoWeight > remainingWeight) {
            const freight = new Freight($('#selected-transport-id').value, $('#selected-description').value, cargoWeight, 'Warehouse 1');
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
    const manifestContainer = document.querySelector('#boxcar-manifest');

    let manifestTable = document.querySelector('#boxcar-manifest tbody');
    if (manifestTable) {
        manifestTable.remove();
    }
    manifestTable = document.createElement('tbody');
    manifestContainer.appendChild(manifestTable);

    let titleElement = document.querySelector('#manifest-title');
    if (!titleElement) {
        titleElement = document.createElement('h2');
        titleElement.id = 'manifest-title';
        manifestContainer.parentNode.insertBefore(titleElement, manifestContainer);
    }
    titleElement.textContent = `CNA - Box Car ${boxcarId} Manifest`;

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
    const freightTable = document.querySelector('#all-freight-table');

    let tbody = freightTable.querySelector('tbody');
    if (tbody) {
        tbody.remove();
    }
    tbody = document.createElement('tbody');
    freightTable.appendChild(tbody);

    const titleElement = document.querySelector('#freight-table-title');
    const selectedBoxcarId = document.querySelector('#selected-boxcar-id').value;
    if (titleElement) {
        titleElement.textContent = `CNA - Box Car ${selectedBoxcarId} Manifest`;
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
    const totalFreightWeightCell = document.querySelector('#total-freight-weight');
    const totalCargoWeightCell = document.querySelector('#total-cargo-weight');
    const selectedBoxcarId = document.querySelector('#selected-boxcar-id').value;

    let totalFreightWeight = freights.reduce((total, freight) => {
        return total + freight.cargoWeight;
    }, 0);

    let totalCargoWeight = freights.reduce((total, freight) => {
        return freight.boxcarId === selectedBoxcarId && freight.cargoWeight !== 0 ? total + freight.cargoWeight : total;
    }, 0);

    totalCargoWeightCell.textContent = totalCargoWeight.toFixed(2);
    totalFreightWeightCell.textContent = totalFreightWeight.toFixed(2);
}


let lastDayValue = null;
let dayTotalWeight = 0;

function createWarehouseTable(warehouses) {
    const tablesContainer = $('#tables-container');
    const dayCounter = $('#day-counter');
    const dayValue = parseInt(dayCounter.value, 10);
    let grandTotalContainer = $('#grand-total-container');

    if (dayValue !== lastDayValue) {
        dayTotalWeight = 0;
    }
    lastDayValue = dayValue;

    if (!grandTotalContainer) {
        grandTotalContainer = document.createElement('div');
        grandTotalContainer.id = 'grand-total-container';
        grandTotalContainer.textContent = 'Total cargo weight all stations: 0 kg';
        tablesContainer.appendChild(grandTotalContainer);
    }

    let table = $(`table[data-day="${dayValue}"]`);
    let tbody, tfoot;

    if (!table) {
        const dayLabel = document.createElement('h2');
        dayLabel.textContent = `CNA Warehouse Manifest Station S${dayValue}`;
        tablesContainer.appendChild(dayLabel);

        table = document.createElement('table');
        table.className = 'warehouse-table';
        table.setAttribute('data-day', dayValue);

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Transport ID', 'Description', 'Cargo Weight'].forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        tbody = document.createElement('tbody');
        table.appendChild(tbody);

        tfoot = document.createElement('tfoot');
        const totalRow = document.createElement('tr');
        totalRow.className = 'day-total-row';

        const totalLabelCell = document.createElement('td');
        totalLabelCell.setAttribute('colspan', '2');
        totalLabelCell.textContent = 'Day Total Weight:';
        totalRow.appendChild(totalLabelCell);

        const weightCell = document.createElement('td');
        weightCell.textContent = '0.00';
        totalRow.appendChild(weightCell);

        tfoot.appendChild(totalRow);
        table.appendChild(tfoot);

        tablesContainer.appendChild(table);
    } else {
        tbody = table.querySelector('tbody');
        tfoot = table.querySelector('tfoot');
    }

    warehouses.forEach(warehouse => {
        if (warehouse.boxcarId === 'Warehouse 1') {
            return;
        }

        let exists = false;
        const rows = tbody.querySelectorAll('tr');
        for (let row of rows) {
            if (row.cells[0].textContent === warehouse.transportId) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            const row = document.createElement('tr');
            const values = [warehouse.transportId, warehouse.description, warehouse.cargoWeight.toFixed(2)];
            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            tbody.appendChild(row);
            dayTotalWeight += warehouse.cargoWeight;

            reduceBoxcarCargoWeight(warehouse.transportId, warehouse.cargoWeight, dayValue);
        }
    });

    const totalWeightCell = tfoot.querySelector('.day-total-row td:last-child');
    totalWeightCell.textContent = dayTotalWeight.toFixed(2);
    updateGrandTotalWeight();
    createBoxCarTable();
    createFreightTable(freights);
}

function updateGrandTotalWeight() {
    let totalWeightAllStations = 0;
    const cells = $$('.day-total-row td:last-child');

    cells.forEach(cell => {
        totalWeightAllStations += parseFloat(cell.textContent || '0');
    });

    const grandTotalContainer = $('#grand-total-container');
    grandTotalContainer.textContent = `Total cargo weight all stations: ${totalWeightAllStations.toFixed(2)} kg`;
    setCookie('totalWeightInWarehouses', totalWeightAllStations.toFixed(2), 1);
}

function advanceDay() {
    var dayCounter = $('#day-counter');
    var dayValue = parseInt(dayCounter.value, 10);
    dayValue += 1; 
    dayCounter.value = dayValue.toString();

    let currentDayWarehouses = freights.filter(freight => {
        let transportIdLastDigit = freight.transportId.slice(-1);
        return parseInt(transportIdLastDigit) === dayValue;
    });

    if (currentDayWarehouses.length > 0) {
        createWarehouseTable(currentDayWarehouses, dayValue);
    }

    if (dayValue == 4) {
        $("#system-summary").disabled = false;
    }
    $("#create-boxcar").disabled = true;
    $("#add-freight").disabled = true;
    $("#return-to-DivB").style.display = 'none';
    $("#divF .return-to-divD").style.display = 'none'
}

function reduceBoxcarCargoWeight(transportId, cargoWeight, dayValue) {
    const freight = freights.find(f => f.transportId === transportId);
    if (!freight || freight.boxcarId.startsWith('Warehouse')) {
        return;
    }

    const boxcar = boxcars.find(b => b.id === freight.boxcarId);
    if (boxcar) {
        boxcar.cargoWeight -= cargoWeight;
        boxcar.grossWeight = boxcar.tareWeight + boxcar.cargoWeight;
        freight.boxcarId = 'Warehouse ' + dayValue;
    } else {
        console.error('Boxcar not found for ID:', freight.boxcarId);
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
    console.log(`Cookie set: ${document.cookie}`);
    console.log(`Cookie retrieved immediately after setting: ${cname}=${getCookie(cname)}`);
}


function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    console.log(`Decoded cookies: ${ca}`);
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();  // Trim spaces from the start of the cookie
        if (c.indexOf(name) === 0) {
            const value = c.substring(name.length, c.length);
            console.log(`Cookie retrieved: ${cname}=${value}`);
            return value;
        }
    }
    console.log(`Cookie not found: ${cname}`);
    return "";
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