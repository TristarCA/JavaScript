const $ = selector => document.querySelector(selector);

function getCookie(name) {
    const cookieIdentifier = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(cookieIdentifier) == 0) return c.substring(cookieIdentifier.length, c.length);
    }
    return null;
}

const totalWeightInBoxcars = parseFloat(getCookie('totalWeightInBoxcars') || '0');
const totalWeightInWarehouses = parseFloat(getCookie('totalWeightInWarehouses') || '0');
const systemTotalWeight = totalWeightInBoxcars + totalWeightInWarehouses;

document.addEventListener('DOMContentLoaded', function() {
    $('#boxcar-weight').value = totalWeightInBoxcars.toFixed(2);
    $('#warehouse-weight').value = totalWeightInWarehouses.toFixed(2);
    $('#system-total-weight').value = systemTotalWeight.toFixed(2);
});
