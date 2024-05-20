"use strict"

const $ = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const boxCarID = $("#BoxCarID").value;
    const emptyWeight = $("#EmptyWeight");
    const totalWeightInput = $("#TotalWeight");
    const transportID = $("#TransportID");
    const description = $("#Description");
    const cargoWeight = $("#CargoWeight");
    const newCargo = $("#NewCargo");
    
    // Create the Cargo Box Car Manifest label
    const cargoBoxCarManifestLabel = document.createElement("label");
    cargoBoxCarManifestLabel.textContent = `Cargo Box Car Manifest for Box Car ${boxCarID}`;
    cargoBoxCarManifestLabel.id = "cargoBoxManifestLabel";

    // Create the table element and its headers
    const cargoTable = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = ["Transport ID", "Description  ", "Weight"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    cargoTable.appendChild(headerRow);

   // Create the footer row for total weight
   const footerRow = document.createElement("tr");
   const footerLabelCell = document.createElement("td");
   footerLabelCell.colSpan = 2;
   footerLabelCell.textContent = "Total Weight";
   const totalWeightCell = document.createElement("td");
   totalWeightCell.id = "totalWeightCell";
   totalWeightCell.textContent = "0";

   footerRow.appendChild(footerLabelCell);
   footerRow.appendChild(totalWeightCell);

   cargoTable.appendChild(footerRow);

   // Append the label and table to the document body
   document.body.appendChild(cargoBoxCarManifestLabel);
   document.body.appendChild(cargoTable);

   newCargo.addEventListener("click", event => {
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
       // Insert the new row before the footer row
       cargoTable.insertBefore(newRow, footerRow);

       // Update the Total Cargo Weight in the Box Car form
       const currentTotalWeight = parseFloat(totalWeightInput.value);
       const newTotalWeight = currentTotalWeight + cargoWeightValue;
       totalWeightInput.value = newTotalWeight;

       // Update the total weight cell in the table footer
       totalWeightCell.textContent = newTotalWeight;

       // Clear the input fields after adding cargo
       transportID.value = "";
       description.value = "";
       cargoWeight.value = "";
   });
});