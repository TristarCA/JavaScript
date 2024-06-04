"use strict" // Demo 55
// task gain access to the hamberger element
// and change it to cheese burger
// Constraint - Start with MAIN
// and use only DOM navivation techniques via
// jQuery
// requires DOM tree diagram
// make it click activated via H3 element
const $ = sel => {
  return document.querySelector(sel);
}
const selAll = sel => {
  return document.querySelectorAll(sel);
}

const processActivity = evt1 => {
  //console.log("Click " + countA++ );
  const main = $("main");
  const mainChildNodes = main.childNodes;
  const divMarker = mainChildNodes[3];
  const divChildNodes = divMarker.childNodes;
  const hambergerNode = divChildNodes[3];
  const hambergerText = hambergerNode.textContent;
  hambergerNode.textContent = "Cheeseburger";
  console.log(hambergerText);
}

const processActivity2 = evt1 => {
  //console.log("Click " + countA++ );
  const main = $("main");

  const hambergerText =main.childNodes[3].
  childNodes[3].textContent;
  console.log(hambergerText);
  main.childNodes[3].childNodes[3].textContent = "Cheeseburger";

}

const addDocumentListeners = () => {
  const allh3Elements = selAll("h3");
  const length = allh3Elements.length;
  for (let i=0; i<length; i++)
  {
      let curElement = allh3Elements[i];
      curElement.addEventListener("click",
               processActivity);
  }
}

// code begins here
let countA = 0;
let labelA = $("#labelA");
labelA.textContent = "Version 55";

// make the button functional
document.addEventListener("DOMContentLoaded",
  addDocumentListeners );
