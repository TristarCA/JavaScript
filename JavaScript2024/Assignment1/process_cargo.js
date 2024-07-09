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
    
    const cargoBoxCarManifestLabel = document.createElement("label");
    cargoBoxCarManifestLabel.textContent = `Cargo Box Car Manifest for Box Car ${boxCarID}`;
    cargoBoxCarManifestLabel.id = "cargoBoxManifestLabel";

    const cargoTable = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = ["Transport ID", "Description  ", "Weight"];

    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    cargoTable.appendChild(headerRow);

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

   document.body.appendChild(cargoBoxCarManifestLabel);
   document.body.appendChild(cargoTable);

   newCargo.addEventListener("click", event => {
       event.preventDefault();

       const transportIDValue = transportID.value;
       const descriptionValue = description.value;
       const cargoWeightValue = parseFloat(cargoWeight.value);

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

       cargoTable.insertBefore(newRow, footerRow);

       const currentTotalWeight = parseFloat(totalWeightInput.value);
       const newTotalWeight = currentTotalWeight + cargoWeightValue;
       totalWeightInput.value = newTotalWeight;

       totalWeightCell.textContent = newTotalWeight;

       transportID.value = "";
       description.value = "";
       cargoWeight.value = "";
   });
});
