const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get('category');

products = products.filter((prod) => prod.category == catParam)[0]["products"]
console.log(products)

// Populate the DOM Form with the product details
for (let i = 0; i < products.length; i++) {
    // Create a product card for each product
    document.querySelector('.row').innerHTML += `
    <!--<form action="/add_to_cart" method="POST" name="qty_form" class="qty_form">-->
    <form onsubmit="addToCart(this); return false;" name="qty_form" class="qty_form">
        <input type="hidden" name="category" value="${catParam}">
        <input type="hidden" name="item_index" value="${[i]}">
        <div class="col-md-6 product_card" style="margin-bottom: 40px; padding: 15px;">
            <div>
                <h5 style="float: center; font-size: 24px;" class="product_name">${products[i].name}</h5>
                <h5 style="float: center; font-size: 20px;">$${(products[i].price).toFixed(2)}</h5>
            </div>  
            <img src="${products[i].image}" style="width: 60%" class="img-thumbnail" alt="${products[i].alt}">
            <div style="height: 90px;">
                <table style="width: 100%; text-align: center; font-size: 18px;" id="product_table">
                    <tr>
                        <!-- Display available quantity for the product -->
                        <td style="text-align: center; width: 35%;">Available: ${products[i].qty_available}</td>

                        <!-- Input field for quantity and buttons to increase/decrease -->
                        <td style="text-align: center; width: 35%;" rowspan="2">
                            <div style="border-radius: 500px; border: 2px solid black; width: 70%; height: 40px; float: center;">
                                <!-- Decrease quantity button with an onclick event -->
                                <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value--; checkInputTextbox(document.getElementById('qty${[i]}_entered'), ${products[i].qty_available});">--</button>

                                <!-- Input field for quantity with onkeyup event -->
                                <input type="text" autocomplete="off" placeholder="0" name="qty" id="qty${[i]}_entered" class="inputBox" onkeyup="checkInputTextbox(this,${products[i].qty_available})">

                                <!-- Increase quantity button with an onclick event -->
                                <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value++; checkInputTextbox(document.getElementById('qty${[i]}_entered'), ${products[i].qty_available});">+</button>
                            </div>

                            <!-- Label for quantity -->
                            <label id="qty${[i]}_label" style="margin: 6px 0; float: center; padding-right: 10px;">Qty:</label>
                        </td>
                    </tr>
                    <tr>
                        <!-- Display sold quantity for the product -->
                        <td style="text-align: center; width: 35%;" id="qty_sold${i}">Sold: ${products[i].qty_sold}</td>
                    </tr>
                    <tr>
                        <!-- Error message for quantity validation -->
                        <td colspan="3" style="padding-top: 5px;"><div id="qty${[i]}_error" style="color: red;"></div></td>
                    </tr>
                </table>
                <button type="submit" class="btn btn-primary">Add to Cart</button>
            </div>  
        </div>
    </form>
    `;
}

// PERFORM CLIENT-SIDE DATA VALIDATION

// Updated validateQuantity function
function validateQuantity(quantity, availableQuantity) {
    let errors = []; // Initialize an array to hold error messages

    quantity=Number(quantity);

    switch (true) {
        case (isNaN(quantity)) && (quantity != ''):
            errors.push("Not a number. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Negative inventory and not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0:
            errors.push("Negative inventory. Please enter a non-negative quantity to order.");
            break;
        case quantity !=0 && !Number.isInteger(quantity):
            errors.push("Not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity > availableQuantity:
            errors.push(`We do not have ${quantity} available.`);
            break;
        // No default case needed as no errors means the array remains empty
    }

    return errors; // Return the array of errors
};


// CHECK INPUT BOXES AGAINST DATA VALIDATION FUNCTION
// Remove leading 0's
// Updated checkInputTextbox function
function checkInputTextbox(textBox, availableQuantity) {
    let str = String(textBox.value);

    // Check if the first character is '0' and remove it if found
    if (str.charAt(0) == '0') {
        textBox.value = Number(str.slice(0, 0) + str.slice(1, str.length));
    }

    // Convert the input value to a number
    let inputValue = Number(textBox.value);

    // Validate the user input quantity using the updated validateQuantity function
    let errorMessages = validateQuantity(inputValue, availableQuantity);

    // Check if there are any error messages and update the display
    let errorDisplay = document.getElementById(textBox.name + '_error');
    if (errorMessages.length > 0) {
        errorDisplay.innerHTML = errorMessages.join('<br>');
        errorDisplay.style.color = "red";
        textBox.parentElement.style.borderColor = "red";
    } else {
        errorDisplay.innerHTML = "";
        textBox.parentElement.style.borderColor = "black";
    }
}



// // STICKY NAV BAR: Referenced from https://www.w3schools.com/howto/howto_js_navbar_sticky.asp
// window.onscroll = function() {stickyNav()};

// // Get the navbar using its id
// let navbar = document.getElementById("sticky-navbar");

// // offsetTop returns the top position relative to the parent (documentation: https://www.w3schools.com/jsref/prop_element_offsettop.asp)
//     // The parent of navbar is body
// let sticky = navbar.offsetTop;

// function stickyNav() {
//     // pageYOffSet returns the pixels a document has scrolled from the upper left corner of the window
//     if (window.pageYOffset >= sticky) {
//         navbar.classList.add("sticky")
//     } else {
//         navbar.classList.remove("sticky");
//     }
// }

// Get the URL
let params = (new URL(document.location)).searchParams;

window.onload = function() {
    /* If there is a server side validation error
    Display message to user and allow them to edit their inputs
    User input is made sticky by retrieving quantities from the URL 
    Those inputs are validated by isNonNegInt again */

    if (params.has('error')) {
       
        document.getElementById('errMsg').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);
    } 
    else if (params.has('inputErr')) {
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);

        for (let i in products) {
            let qtyInput = qty_form[`qty${[i]}_entered`];
            let qtyError = document.getElementById(`qty${[i]}_error`);

            // Set the value from URL parameters
            if (params.get(`qty${i}`) !== null) {
                qtyInput.value = params.get(`qty${i}`);
            }

            // Validate the quantity and display errors
            let errorMessages = validateQuantity(qtyInput.value, products[i].qty_available);
            if (errorMessages.length > 0) {
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = "red";
            } else {
                qtyError.innerHTML = "";
                qtyInput.parentElement.style.borderColor = "black";
            }
        }
    }
}

function addToCart(formElement) {
    // Ensure the passed element is a form
    if (!(formElement instanceof HTMLFormElement)) {
        console.error("addToCart called with an invalid element");
        return;
    }

    // Create a FormData object
    let formData = new FormData(formElement);

    // Extract values from the FormData object
    let category = formData.get('category'); // Replace 'category' with the actual name attribute of the form field
    let itemIndex = formData.get('item_index'); // Replace 'item_index' with the actual name attribute
    let qty = formData.get('qty'); // Replace 'qty' with the actual name attribute

    // Construct the object
    let result = {
        category: category || "",
        item_index: itemIndex,
        qty: parseInt(qty) || 0
    };

    if (result["item_index"] == null) {
        return;
    }

    // Use the result object as needed
    console.log(result);

    let cart = JSON.parse(localStorage.getItem("myCart"));
    if (cart == null) {
        cart = {};
        // cart[result["category"]] = {};
    }

    console.log(cart)

    if (!cart.hasOwnProperty(result["category"])) {
        cart[result["category"]] = {};
    }

    if (!cart[result["category"]].hasOwnProperty(result["item_index"])) {
        cart[result["category"]][result["item_index"]] = 0
    }
    cart[result["category"]][result["item_index"]] += result["qty"]
    
    localStorage.setItem("myCart", JSON.stringify(cart))
    console.log(cart)

    location.reload();
}


document.querySelectorAll('.qty_form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        // addToCart(this);
    });
});
