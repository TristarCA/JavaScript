"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const totalWeightInput = $("#TotalWeight");
    const newCargo = $("#NewCargo");
    const transportID = $("#TransportID");
    const description = $("#Description");
    const cargoWeight = $("#CargoWeight");
    const boxCarID = $("#BoxCarID").value;

    // Create the Cargo Box Car Manifest label
    const cargoBoxCarManifestLabel = document.createElement("label");
    cargoBoxCarManifestLabel.textContent = `Cargo Box Car Manifest for Box Car ${boxCarID}`;
    cargoBoxCarManifestLabel.id = "cargoBoxManifestLabel";

    // Create the table element and its headers
    const cargoTable = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = ["Transport ID", "Description", "Weight"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    cargoTable.appendChild(headerRow);

    // Append the label and table to the document body
    document.body.appendChild(cargoBoxCarManifestLabel);
    document.body.appendChild(cargoTable);

    newCargo.addEventListener("click", () => {
        // Prevent default form submission behavior
        event.preventDefault();

        // Get the values from the input fields
        const transportIDValue = transportID.value;
        const descriptionValue = description.value;
        const cargoWeightValue = parseFloat(cargoWeight.value);

        // Create a new row for the table
        const newRow = document.createElement("tr");

        // Populate the new row with the values
        const transportIDCell = document.createElement("td");
        transportIDCell.textContent = transportIDValue;
        newRow.appendChild(transportIDCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = descriptionValue;
        newRow.appendChild(descriptionCell);

        const cargoWeightCell = document.createElement("td");
        cargoWeightCell.textContent = cargoWeightValue;
        newRow.appendChild(cargoWeightCell);

        // Append the new row to the table
        cargoTable.appendChild(newRow);

        // Update the Total Cargo Weight in the Box Car form
        const currentTotalWeight = parseFloat(totalWeightInput.value);
        totalWeightInput.value = currentTotalWeight + cargoWeightValue;
        
        transportID.value = "";
        description.value = "";
        cargoWeight.value = "";
    });
});
