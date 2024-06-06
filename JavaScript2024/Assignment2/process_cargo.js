"use strict";

const $ = selector => document.querySelector(selector);

const boxCarID = $("#BoxCarID").value;
const emptyWeight = parseFloat($("#EmptyWeight").value);
const maxWeight = parseFloat($("#MaxWeight").value);
const currentWeightInput = $("#CurrentWeight");
const transportID = $("#TransportID");
const description = $("#Description");
const cargoWeight = $("#CargoWeight");
const newCargo = $("#NewCargo");

document.addEventListener("DOMContentLoaded", () => {
    const createNoneRow = (colSpan, text) => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = colSpan;
        cell.textContent = text;
        row.appendChild(cell);
        return row;
    };

    const cargoStatusTable = document.querySelector(".status table");
    const manifestTable = document.querySelector(".manifest table");
    
    const cargoStatusNoneRow = createNoneRow(4, "None");
    const manifestNoneRow = createNoneRow(3, "None");
    cargoStatusTable.appendChild(cargoStatusNoneRow);
    manifestTable.appendChild(manifestNoneRow);

    const manifestHeader = $("#manifestHeader");
    manifestHeader.textContent = `Manifest: ${boxCarID}`;

    const totalWeightRow = document.createElement("tr");
    totalWeightRow.id = "totalWeightRow";
    const totalWeightLabelCell = document.createElement("td");
    totalWeightLabelCell.textContent = "Total Weight: ";
    totalWeightLabelCell.style.fontWeight = "bold";
    totalWeightRow.appendChild(totalWeightLabelCell);
    const totalWeightCell = document.createElement("td");
    totalWeightRow.appendChild(totalWeightCell);
    manifestTable.appendChild(totalWeightRow);

    newCargo.addEventListener("click", event => {
        event.preventDefault();

        const transportIDValue = transportID.value;
        const descriptionValue = description.value;
        let cargoWeightValue = cargoWeight.value;
        const maxCargoWeight = maxWeight - emptyWeight;

        if (!transportIDValue || !descriptionValue || !cargoWeightValue) {
            alert("All fields must contain data. Please check your inputs!");
            cargoWeightValue = parseFloat(cargoWeight.value)
            return;
        }

        cargoWeightValue = parseFloat(cargoWeight.value)
    
        if (isNaN(cargoWeightValue)) {
            alert("Input cargo weight must be a numeric value! Please input a number!");
            return;
        }

        if (cargoWeightValue <= 0 || cargoWeightValue > maxCargoWeight) {
            alert(cargoWeightValue <= 0 ? 
                "Cargo weight must be a positive number that is larger than 0." : 
                `Cargo weight exceeds the maximum allowed weight. The max weight allowed is ${maxCargoWeight}.`);
            return;
        }

        const currentTotalWeight = parseFloat(currentWeightInput.value);
        const newTotalWeight = currentTotalWeight + cargoWeightValue;

        const createRow = (values, status) => {
            const row = document.createElement("tr");
            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            if (status) {
                const statusCell = document.createElement("td");
                statusCell.textContent = status;
                row.appendChild(statusCell);
            }
            return row;
        };

        if (newTotalWeight > maxWeight) {
            const newRow = createRow([transportIDValue, descriptionValue, cargoWeightValue], "Warehouse");
            cargoStatusTable.appendChild(newRow);
            transportID.value = "";
            description.value = "";
            cargoWeight.value = "";
            alert(`Total weight exceeds the maximum allowable weight of ${maxWeight} lbs. Current total weight: ${currentTotalWeight} lbs. Sending Cargo to Warehouse`);
            return;
        }

        const newRow = createRow([transportIDValue, descriptionValue, cargoWeightValue, boxCarID]);
        cargoStatusNoneRow.remove();
        cargoStatusTable.appendChild(newRow);

        const manifestRow = createRow([transportIDValue, descriptionValue, cargoWeightValue]);
        manifestNoneRow.remove();
        manifestTable.insertBefore(manifestRow, totalWeightRow);
        currentWeightInput.value = newTotalWeight;

        totalWeightCell.textContent = newTotalWeight - 15000;

        transportID.value = "";
        description.value = "";
        cargoWeight.value = "";
    });
});
