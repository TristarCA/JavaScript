"use strict";

const $ = selector => document.querySelector(selector);
const selAll = selector => document.querySelectorAll(selector);

var master_clock_var = 0;
var master_clock_step_var = 0;

var power_level_var = 0;
var power_level_step_var = 0;

var charge_status = 0;
var driving_status = 0;

const drive_car_process = () => {

}


const tick = () => {
  // alert("Tick");
  master_clock_var += master_clock_step_var;
  $("#timer_id").value = master_clock_var;
}

const start_timer = () => {
  alert("Timer Started");
  // Using an Interval Timer
  master_clock_step_var = 1;
  setInterval(tick, 0.000000000000000002);

}


const reset_system = () => {

}

const charge_battery = () => {
  driving_status = 0
  charge_status = 1;
  power_level_step_var = 1
  const driving_indicator = $("#battery_drain_id");
  const charging_indicator = $("#battery_charge_id");
  driving_indicator.checked = false;
  charging_indicator.checked = true;
}


const drive_car = () => {
  driving_status = 1;
  charge_status = 0;
  power_level_step_var = -1;
  const driving_indicator = $("#battery_drain_id");
  const charging_indicator = $("#battery_charge_id");
  driving_indicator.checked = true;
  charging_indicator.checked = false;
}

document.addEventListener("DOMContentLoaded", () => {
    $("#charge_battery_btn").addEventListener("click", charge_battery);
    $("#drive_car_btn").addEventListener("click", drive_car);
    $("#start_btn").addEventListener("click", start_timer);
    $("#reset_btn").addEventListener("click", reset_system);

  });
