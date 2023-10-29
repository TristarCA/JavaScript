document.addEventListener("DOMContentLoaded", function() {
    const $ = function (id) {
        return document.getElementById(id);
    }

    var joinList = function () {
        var email_address1 = $("email_address1").value;
        var email_address2 = $("email_address2").value;
        var first_name = $("first_name").value
        var isValid = true;

        if (email_address1 == "") { 
            $("email_address1_error").textContent = "Email is required*";
            isValid = false;
        } else {    
            $("email_address1_error").textContent = ""
        }

        if (email_address2 != email_address1) { 
            $("email_address2_error").textContent = "Must match first email*";
            isValid = false;
        } else {
            $("email_address2_error").textContent = ""
        }

        if (first_name == "") {
		$("first_name_error").textContent = "Name is required*";
		isValid = false;
    	} else { 
            $("first_name_error").textContent = ""; 
        } 

        if (isValid) {
            console.log("Form is valid. Submitting....");
            $("email_form").submit();
        }
        return false;
    };

    window.onload = function () {
        $("join").onclick = joinList;
        $("email_address1").focus();
    }
});