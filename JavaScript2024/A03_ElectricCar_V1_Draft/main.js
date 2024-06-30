"use strict";

const $ = selector => document.querySelector(selector);

let masterClock = 0;
let clockStep = 0;
let tickInterval = null;

let isCharging = false;
let isDriving = false;
let invalidSpeed = false;

const batteryPowerInput = $("#battery_power_id");
const speedKmhInput = $("#speed_KMH_id");
const speedKmmInput = $("#speed_KMM_id");
const batteryMinLeftInput = $("#battery_min_id");

const statusSpan = document.createElement("span");
statusSpan.id = "span_id";
statusSpan.textContent = "Simulator not yet started";
const timerInput = $("#timer_id");
timerInput.parentNode.insertBefore(statusSpan, timerInput.nextSibling);

const errorSpan = document.createElement("span");
errorSpan.id = "errorSpan_id";
speedKmhInput.parentNode.insertBefore(errorSpan, speedKmhInput.nextSibling);

const tick = () => {
  masterClock += clockStep;
  $("#timer_id").value = masterClock;

  let batteryPower = parseFloat(batteryPowerInput.value);

  if (isCharging) {
    batteryPower += 12;
    if (batteryPower >= 100) {
      batteryPower = 100;
      $("#battery_charge_id").checked = false;
      statusSpan.textContent = "Battery Charged";
    } else {
      statusSpan.textContent = "Battery Charging";
    }
  } else if (isDriving) {
    let speedKmh = parseInt(speedKmhInput.value);
    invalidSpeed = false;
    statusSpan.textContent = "Driving Car";
    speedKmmInput.value = (speedKmh / 60).toFixed(2);
    let reductionRate = speedKmh / 60;
    batteryPower -= reductionRate;
    if (batteryPower <= 0) {
      batteryPower = 0;
      speedKmhInput.value = 0;
      speedKmmInput.value = 0;
      statusSpan.textContent = "Battery Depleted";
      batteryMinLeftInput.value = 0;
      $("#battery_drain_id").checked = false;
    } else {
      batteryMinLeftInput.value = (batteryPower / reductionRate).toFixed(0);
    }
  } else {
    speedKmhInput.value = 0;
    speedKmmInput.value = 0;
    statusSpan.textContent = "Battery Depleted";
  }

  batteryPowerInput.value = batteryPower.toFixed(2);
};

const startTimer = () => {
  alert("Timer Started");
  statusSpan.textContent = "Simulator Started";
  clockStep = 1;
  clearInterval(tickInterval);
  tickInterval = setInterval(tick, 2000);
};

const resetSystem = () => {
  masterClock = 0;
  clockStep = 0;
  isCharging = false;
  isDriving = false;
  invalidSpeed = false;
  batteryPowerInput.value = 0;
  statusSpan.textContent = "Reset Simulator";
  $("#timer_id").value = 0;
  $("#speed_KMH_id").value = 0;
  $("#speed_KMM_id").value = 0;
  $("#battery_min_id").value = 0;
  $("#battery_charge_id").checked = false;
  $("#battery_drain_id").checked = false;

  clearInterval(tickInterval);
};

const chargeBattery = () => {
  isDriving = false;
  isCharging = true;
  invalidSpeed = false;
  statusSpan.textContent = "Battery Charging";
  $("#battery_drain_id").checked = false;
  $("#battery_charge_id").checked = true;
};

const driveCar = () => {
  let speedKmh = parseInt(speedKmhInput.value);
  if (!isNaN(speedKmh) && speedKmh > 0 && speedKmh <= 240) {
    errorSpan.textContent = "";
    isDriving = true;
    isCharging = false;
    invalidSpeed = false;
    statusSpan.textContent = "Driving Car";
    $("#battery_drain_id").checked = true;
    $("#battery_charge_id").checked = false;
  } else {
    invalidSpeed = true;
    errorSpan.textContent = "Invalid Input";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  $("#charge_battery_btn").addEventListener("click", chargeBattery);
  $("#drive_car_btn").addEventListener("click", driveCar);
  $("#start_btn").addEventListener("click", startTimer);
  $("#reset_btn").addEventListener("click", resetSystem);
});
