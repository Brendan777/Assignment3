window.onload = function() {
    // Initialize a variable to store the subtotal
    let subtotal = 0;

    let cart = JSON.parse(localStorage.getItem("myCart"));
    if (cart == null) {
        return;
    }

    for (const [category, items] of Object.entries(cart)) {
        // aggregation += Object.values(value).reduce((sum, cur) => sum + cur, 0);
        for (const [item_index, count] of Object.entries(items)) {
            producs_in_category = products.filter((prod) => prod.category == category)[0]["products"]
            extended_price = (count * producs_in_category[item_index].price).toFixed(2);
            subtotal += Number(extended_price);
            // Populate the invoice table with product details and extended prices
            document.querySelector('#invoice_table').innerHTML += `
                <tr style="border: none;">
                    <td width="10%"><img src="${producs_in_category[item_index].image}" alt="${producs_in_category[item_index].alt}" style="border-radius: 5px; width: 50px; height: auto;"></td>
                    <td>${producs_in_category[item_index].name}</td>
                    <td>${count}</td>
                    <td>${producs_in_category[item_index].qty_available}</td>
                    <td>$${producs_in_category[item_index].price.toFixed(2)}</td>
                    <td>$${extended_price}</td>
                </tr>
            `;
        } 
    }

    // Calculate sales tax based on the subtotal
    let tax_rate = (4.2 / 100);
    let tax_amt = subtotal * tax_rate;

    // Calculate shipping based on the subtotal
    let shipping;
    let shipping_display;
    let total;

    if (subtotal < 300) {
        shipping = 15;
        shipping_display = `$${shipping.toFixed(2)}`;
        total = Number(tax_amt + subtotal + shipping);
    } else {
        shipping = 0;
        shipping_display = 'FREE';
        total = Number(tax_amt + subtotal + shipping);
    }

    // Populate the total section of the invoice
    document.querySelector('#total_display').innerHTML += `
        <tr style="border-top: 2px solid black;">
            <td colspan="5" style="text-align:center;">Sub-total</td>
            <td>$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;">Tax @ ${Number(tax_rate) * 100}%</td>
            <td>$${tax_amt.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;">Shipping</td>
            <td>${shipping_display}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;"><b>Total</td>
            <td><b>$${total.toFixed(2)}</td>
        </tr>
    `;
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("myCart"));
    if (cart == null) {
        return;
    }

    fetch('/purchase_login_check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.user != null) {
            window.location.href = '/invoice.html';
          } else {
            window.location.href = '/login.html';
            // throw new Error('Network response was not ok.');
          }
      })
      .catch(error => console.error('Error:', error));
}