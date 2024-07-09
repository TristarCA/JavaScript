"use strict";

const $ = selector => document.querySelector(selector);
const selAll = selector => document.querySelectorAll(selector);

var data_count = 0;
var total_cargo_weight = 0;

const gen_td = (currentRowElement, td_txt, td_id) => {
  const newElement = document.createElement("td");
  if (td_id != "") {
    newElement.id = td_id;
  }
  const textNode = document.createTextNode(td_txt);
  newElement.append(textNode);
  currentRowElement.append(newElement);
}

const gen_tr = (tr_id_txt, desc_txt, cgwt_val) => {
  const newElement = document.createElement("tr");
  newElement.id = tr_id_txt;
  const currentElement = $("tbody");
  const lastElement = $("#lastrow");

  const currentRowElement = newElement;
  currentElement.insertBefore(newElement, lastElement);
  gen_td(currentRowElement, tr_id_txt, "");
  gen_td(currentRowElement, desc_txt, "");
  gen_td(currentRowElement, cgwt_val, "");
}

const gen_tf = (f_value) => {
  const newElement = document.createElement("tf");
  const textNode = document.createTextNode(f_value);
  newElement.appendChild(textNode);
  const currentElement = $("tfoot");
  currentElement.appendChild(newElement);
  currentElement.id = "table_cargo_weight";
}

const gen_th = (h_title) => {
  const newElement = document.createElement("th");
  const text = document.createTextNode(h_title);
  newElement.appendChild(text);
  const currentElement = $("thead");
  currentElement.appendChild(newElement);
}

const gen_table = (table_name) => {
  const newTable = document.createElement("table");
  newTable.id = table_name;
  const topMarker = $("h3");
  const parent = topMarker.parentNode;
  parent.insertBefore(newTable, topMarker.nextElementSibling);
  const tableHeader = document.createElement("thead")
  newTable.appendChild(tableHeader);

  gen_th("Transport ID");
  gen_th("Description");
  gen_th("Cargo Weight");

  const tableBody = document.createElement("tbody")
  newTable.appendChild(tableBody);

  const tableFooter = document.createElement("tfoot")
  newTable.appendChild(tableFooter);

  gen_tf("");
}


const gen_h3 = (boxcar_id) => {
  const text1 = `Cargo Box Car Manifest for Box Car ${boxcar_id} `;
  const newElement = document.createElement("h3");
  const elementText = document.createTextNode(text1);
  newElement.appendChild(elementText);
  const topMarker = $("#add_cargo_form");
  const parent = topMarker.parentNode;
  parent.insertBefore(newElement, topMarker.nextElementSibling);
}


const add_to_document = (tr_id_txt, desc_txt, cgwt_val) => {
  const msg = "add_to_document";
  // alert (msg);

  if (data_count == 0) {
    total_cargo_weight = parseInt(cgwt_val);
    gen_h3("BX500");
    gen_table("BX500");
    // gen_tr("lastrow", "Total Cargo Weight", 0);
    gen_tr(tr_id_txt, desc_txt, cgwt_val);

  }
  else {
    gen_tr(tr_id_txt, desc_txt, cgwt_val);
    total_cargo_weight = total_cargo_weight + parseInt(cgwt_val);
  }
  data_count = data_count + 1;
  $("#table_cargo_weight").textContent = `Total Cargo Weight ${total_cargo_weight}`;

  var empty_weight_val = parseInt($("#empty_weight_id").value);
  $("#total_weight_id").value = total_cargo_weight + empty_weight_val;
}

const process_cargo = () => {

  const tr_id_txt = $("#transport_id").value;
  const desc_txt = $("#description_id").value;
  const cgwt_val = $("#cargo_weight_id").value;

  add_to_document(tr_id_txt, desc_txt, cgwt_val);
}

const reset_cargo = () => {
  const msg = "Resetting Cargo";
  alert(msg);
  const clearFields = selAll(".clearx");
  for (let flds of clearFields)
    flds.value = "";
}

document.addEventListener("DOMContentLoaded",
  () => {
    const msg = "The DOM is Ready!";
    // alert (msg);

    $("#process_cargo_btn").addEventListener("click", process_cargo);
    $("#process_cargo_reset_btn").addEventListener("click", reset_cargo);

    const bxcar_id_txt = $("#box_car_id").value;
    console.log(bxcar_id_txt);
  });
