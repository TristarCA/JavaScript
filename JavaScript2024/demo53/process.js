"use strict" // Demo 53
// Multiple class selections
// Selecting relative nodes
// document the node tree first
// plan (1) gain access to all of 
// the elements with class "menu"
// then (2) gain access to the DIV element
// that directly follows
// then (3) then gain access to the 
// first child element
// then (4) walk the child element chain
// then in the chain (5) change the color of the 
// selected child element to orange
const $ = sel => {
  return document.querySelector(sel);
}
const selAll = sel => {
  return document.querySelectorAll(sel);
}

const clickCounter = evt1 => {
  labelA.textContent = countA++;
  processClick(evt1);
}

const processClick = evt1 => {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
  const currentElement = evt1.currentTarget;
  currentElement.classList.toggle("blue");
  const divElement = currentElement.nextElementSibling;
  let child = divElement.firstElementChild;
  let i = 0;

  while (child.nextElementSibling != null) {
    child.classList.toggle(colors[i])
    child = child.nextElementSibling;
    i++
  }
}

const addDocumentListeners = () => {
  const allh3Elements = selAll("h3");
  const length = allh3Elements.length;
  for (let i=0; i<length; i++)
  {
      let curElement = allh3Elements[i];
      curElement.addEventListener("click",clickCounter);
  }
}

// code begins here
let countA = 0;
let labelA = $("#labelA");
labelA.textContent = "Version 53";

// make the button functional
document.addEventListener("DOMContentLoaded",
  addDocumentListeners );
