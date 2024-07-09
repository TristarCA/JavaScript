"use strict" // Demo 50
const $ = sel => {
  return document.querySelector(sel);
}

const buttonAactivity = () => {
  labelA.textContent = countA++;
  // find button ch3 and toggle its hide class existance
  let hamburger = $("#ch3");
  hamburger.classList.toggle("hide");
}

const addDocumentListeners = () => {
  $("#buttonA").addEventListener("click", buttonAactivity);
}

// code begins here
let countA = 0;
let labelA = $("#labelA");
labelA.textContent = "Version 1";

// make the button functional
document.addEventListener("DOMContentLoaded",
  addDocumentListeners );
