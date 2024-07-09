"use strict"

const $ = selector => document.querySelector(selector);


document.addEventListener("DOMContentLoaded", () => {
  $("#day_id").value = 1;
  // reset_form();

  $("#yn_input_id").change(evt => { next_day() })
  
  $('#precipitation_input_id').addEventListener('input', function(e) {
  check_percipitation_input(this.value)
})
});

const next_day = () => {
  var yn = $("#yn_input_id").val();
  if (yn == "Y" || yn == "y") {
    day_val++;
    $("#day_id").val(day_val);
  }
  $("#yn_input_id").val("");
}



const check_precipitation_input = () => {
  var precipitation_input_ele = $("#precipitation_input_id");
  var precipitation_input_txt = precipitation_input_ele.val();
  var precipitation_input_val = -1;
  error_status_p = false;

  if (isNaN(precipitation_input_txt) ||
    precipitation_input_txt == "") {
    error_status_p = true;
    precipitation_input_ele.next().text("Error - Not a Number");
    $("inches_display_id").val("0");
  }
  else {
    precipitation_input_val = parseInt(precipitation_input_txt);

    if (precipitation_input_val < 0 ||
      precipitation_input_val > 1000) {
      error_status_p = true;
      precipitation_input_ele.next().text("Error - <0 or > 1000");
      $("#inches_display_id").val("0");
    }
    else {
      precipitation_input_ele.next().text("");
      var inches_val = 0;
      $("#inches_display_id").val(inches_val);
    }
  }
}

const reset_form = () => {
  $("#precipitation_input_id").val("0");
  $("#precipitation_input_id").next().text("");
  $("inches_display_id").val("0");
  $("rain_selected_id").checked = true;
  $("snow_selected_id").checked = false;
}
