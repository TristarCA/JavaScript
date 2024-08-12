// Inventory prices array
const prices = [2.95, 3.95, 5.95, 9.95, 12.95];

// Function to calculate the total using map and reduce
function calculateTotal() {
    // Use reduce to sum up all the prices
    const total = prices.reduce((acc, price) => acc + price, 0);
    return total.toFixed(2);
}

// Handle the button click event
document.getElementById('calculateButton').addEventListener('click', function() {
    const totalAmount = calculateTotal();
    document.getElementById('totalAmount').innerText = `$${totalAmount}`;
});
