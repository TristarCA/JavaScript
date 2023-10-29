var $ = function (id) {
    return document.getElementById(id);
}

var joinList = function () {
	var emailAddress1 = $("email_address1").value;
	var emailAddress2 = $("email_address2").value;
	var radioYes = $("yes");
	var radioNo = $("no")
    var messageElement = $("message");
	var isValid = true;
	
	if (emailAddress1 == "") { 
		$("email_address1_error").firstChild.nodeValue = "This field is required.";
		isValid = false;
	} else { $("email_address1_error").firstChild.nodeValue = ""; } 

	if (emailAddress1 != emailAddress2) { 
		$("email_address2_error").firstChild.nodeValue = "This entry must equal first entry.";
		isValid = false;
	} else { $("email_address2_error").firstChild.nodeValue = ""; }
	
	if ($("first_name").value == "") {
		$("first_name_error").firstChild.nodeValue = "This field is required.";
		isValid = false;
	} else { $("first_name_error").firstChild.nodeValue = ""; }  
	
	

    if (!radioYes.checked && !radioNo.checked) {
        radioError.textContent = "Please select an option.";
		isValid = false;
    }   else {
        radioError.textContent = "";
    }

	if (isValid) {
		$("email_form").submit();
	}

	if (radioYes.checked) {
		messageElement.textContent = "";
	}	else {
		messageElement.textContent = "Please read the Terms and Conditions!";
	}
	
	if (isValid) {
		$("email_form").submit(); 
	}
}


window.onload = function () {
    $("join_list").onclick = joinList;
    $("email_address1").focus();
}