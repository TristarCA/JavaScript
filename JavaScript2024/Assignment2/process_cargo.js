"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const boxCarID = $("#BoxCarID").value;
    const emptyWeight = parseFloat($("#EmptyWeight").value);
    const maxWeight = parseFloat($("#MaxWeight").value);
    const currentWeightInput = $("#CurrentWeight");
    const transportID = $("#TransportID");
    const description = $("#Description");
    const cargoWeight = $("#CargoWeight");
    const newCargo = $("#NewCargo");
    
    const cargoStatusTable = document.querySelector(".status table");
    const manifestTable = document.querySelector(".manifest table");
    
    const cargoStatusNoneRow = document.createElement("tr");
    const cargoStatusNoneCell = document.createElement("td");
    cargoStatusNoneCell.colSpan = 4;
    cargoStatusNoneCell.textContent = "None";
    cargoStatusNoneRow.appendChild(cargoStatusNoneCell);
    cargoStatusTable.appendChild(cargoStatusNoneRow);

    const manifestNoneRow = document.createElement("tr");
    const manifestNoneCell = document.createElement("td");
    manifestNoneCell.colSpan = 3;
    manifestNoneCell.textContent = "None";
    manifestNoneRow.appendChild(manifestNoneCell);
    manifestTable.appendChild(manifestNoneRow);
    const manifestHeader = document.getElementById("manifestHeader");
    const newText = document.createTextNode('Manifest:  ' + boxCarID);
    manifestHeader.textContent = '';
    manifestHeader.appendChild(newText);

    const totalWeightRow = document.createElement("tr");
    totalWeightRow.id = "totalWeightRow";
    const totalWeightLabelCell = document.createElement("td");
    totalWeightLabelCell.textContent = "";
    totalWeightRow.appendChild(totalWeightLabelCell);
    const totalWeightCell = document.createElement("td");
    totalWeightRow.appendChild(totalWeightCell);
    manifestTable.appendChild(totalWeightRow);

    newCargo.addEventListener("click", event => {
        event.preventDefault();

        const transportIDValue = transportID.value;
        const descriptionValue = description.value;
        const cargoWeightValue = parseFloat(cargoWeight.value);
        const maxCargoWeight = maxWeight - emptyWeight;

        if (!transportIDValue || !descriptionValue || isNaN(cargoWeightValue)) {
            alert("All fields must contain valid data. Please check your inputs!");
            return;
        }

        if (cargoWeightValue <= 0 || cargoWeightValue > maxCargoWeight) {
            if (cargoWeightValue <= 0) {
                alert("Cargo weight must be a positive number that is larger than 0.");
            } else {
                alert(`Cargo weight exceeds the maximum allowed weight. The max weight allowed is ${maxCargoWeight}.`);
            }
            return;
        }

        const currentTotalWeight = parseFloat(currentWeightInput.value);
        const newTotalWeight = currentTotalWeight + cargoWeightValue;

        if (newTotalWeight > maxWeight) {
            const newRow = document.createElement("tr");
            const transportIDCell = document.createElement("td");
            transportIDCell.textContent = transportIDValue;
            newRow.appendChild(transportIDCell);
            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = descriptionValue;
            newRow.appendChild(descriptionCell);
            const cargoWeightCell = document.createElement("td");
            cargoWeightCell.textContent = cargoWeightValue;
            newRow.appendChild(cargoWeightCell);
            const statusCell = document.createElement("td");
            statusCell.textContent = "Warehouse";
            newRow.appendChild(statusCell);
            cargoStatusTable.appendChild(newRow);
            alert(`Total weight exceeds the maximum allowable weight of ${maxWeight} lbs. Current total weight: ${currentTotalWeight} lbs. Sending Cargo to Warehouse`);
            transportID.value = "";
            description.value = "";
            cargoWeight.value = "";
            return;
        }

        const newRow = document.createElement("tr");

        const transportIDCell = document.createElement("td");
        transportIDCell.textContent = transportIDValue;
        newRow.appendChild(transportIDCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = descriptionValue;
        newRow.appendChild(descriptionCell);

        const cargoWeightCell = document.createElement("td");
        cargoWeightCell.textContent = cargoWeightValue;
        newRow.appendChild(cargoWeightCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = `${boxCarID}`;
        newRow.appendChild(statusCell);

        if (cargoStatusNoneRow.parentElement) {
            cargoStatusNoneRow.parentElement.removeChild(cargoStatusNoneRow);
        }
        cargoStatusTable.appendChild(newRow);

        const manifestRow = document.createElement("tr");

        const manifestTransportIDCell = document.createElement("td");
        manifestTransportIDCell.textContent = transportIDValue;
        manifestRow.appendChild(manifestTransportIDCell);

        const manifestDescriptionCell = document.createElement("td");
        manifestDescriptionCell.textContent = descriptionValue;
        manifestRow.appendChild(manifestDescriptionCell);

        const manifestCargoWeightCell = document.createElement("td");
        manifestCargoWeightCell.textContent = cargoWeightValue;
        manifestRow.appendChild(manifestCargoWeightCell);

        if (manifestNoneRow.parentElement) {
            manifestNoneRow.parentElement.removeChild(manifestNoneRow);
        }
        manifestTable.insertBefore(manifestRow, totalWeightRow);
        currentWeightInput.value = newTotalWeight;

        totalWeightLabelCell.textContent = "Total Weight: ";
        totalWeightCell.textContent = newTotalWeight - 15000;

        transportID.value = "";
        description.value = "";
        cargoWeight.value = "";
    });
});