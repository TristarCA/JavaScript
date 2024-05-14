"use strict"

const $ = selector => document.querySelector(selector);
const boxCarId = $("#BoxCarID");
const emptyWeight = $("#EmptyWeight");
const totalWeight = $("#TotalWeight");
const transportID = $("#TransportID");
const description = $("#Description");
const cargoWeight = $("#CargoWeight");
const newCargo = $("#NewCargo");
const resetCargo = $("#ResetCargo");

document.addEventListener("DOMContentLoaded", () => {
    newCargo.addEventListener("click", () => {
        console.log(transportID)
        alert(boxCarId.value)
        alert(emptyWeight.value)
        alert(totalWeight.value)
        alert(transportID.value)
        alert(description.value)
        alert(cargoWeight.value)
    });
});