module.exports = {
	parse_items: function(POST, items_to_remove){
		let items = JSON.parse(JSON.stringify(POST));
		items_to_remove.forEach((element) => {
			if (items.hasOwnProperty(element)){
				delete items[element];
			}
		});
		return items;
	},

	process_purchase: function(POST, response) {
		let has_qty = false;
		let errorObject = {};

		for (let i in products) {
			let qty = POST[`qty${[i]}`];
			has_qty = has_qty || (qty > 0)
			let errorMessages = validateQuantity(qty, products[i].qty_available);
			if (errorMessages.length > 0) {
				errorObject[`qty${[i]}_error`] = errorMessages.join(',');
			}
		}

		if (has_qty == false && Object.keys(errorObject).length == 0) {
			response.redirect("./products_display.html?error");
		}
		else if (has_qty == true && Object.keys(errorObject).length == 0) {
			for (let i in products) {
				let qty = POST[`qty${[i]}`];
				products[i].qty_sold += Number(qty);
				products[i].qty_available = products[i].qty_available - qty;
			}
			response.redirect("./invoice.html?valid&" + qs.stringify(POST));
		}
	},


	// Function to validate quantity entered by the user against available quantity
	validateQuantity: function(quantity, availableQuantity) {
		let errors = [];  // Initialize an array to hold error messages

		quantity = Number(quantity); // Convert quantity to a number

		if (isNaN(quantity) || quantity === '') {
			errors.push("Not a number. Please enter a non-negative quantity to order.");
		} else if (quantity < 0 && !Number.isInteger(quantity)) {
			errors.push("Negative inventory and not an integer. Please enter a non-negative quantity.");
		} else if (quantity < 0) {
			errors.push("Negative inventory. Please enter a non-negative quantity to order.");
		} else if (quantity != 0 && !Number.isInteger(quantity)) {
			errors.push("Not an integer. Please enter a non-negative quantity to order.");
		} else if (quantity > availableQuantity) {
			errors.push(`We do not have ${quantity} available.`);
		}

		return errors;
	},

	initalization: function(products) {
		console.log("Initalizing Json Files");
		console.log(products)

		headers = products.map((prod) => prod.category)

		console.log(products.filter((prod) => prod.category == "Bags"))
		// products.forEach((prod, i ) => {prod.qty_sold = 0});
	},

	getProductCategories: function(products){
		return products.map((prod) => prod.category);
	},

	
// Email Validation
isValidEmail: function(email) {
    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
},
// Password validation
isValidPassword: function(password) {
    const passwordRegex = /^[^\s]{10,16}$/;
    return passwordRegex.test(password);
},

// Confirm password validation
doPasswordsMatch: function(password, confirmPassword) {
    return password === confirmPassword;
},

// Full name validation
isValidFullName: function(fullName) {
    const nameRegex = /^[a-zA-Z ]{2,30}$/; 
    return nameRegex.test(fullName);
},

// Email uniqueness check (assumes 'all_users' is the object containing all user data)
isEmailUnique:function(email, all_users) {
    return !all_users.hasOwnProperty(email.toLowerCase());
}
}