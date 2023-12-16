// import * as slib from './server_lib.js';
const slib = require('./server_lib.js');

const express = require('express');
const session = require('express-session');
const { readFile, writeFile, fstat } = require('fs');

const products = require(__dirname + "/products.json");
const qs = require('querystring');								// Used to convert JavaScript objects into a URL query string
const app = express();

app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true})); 					// Add Express middleware for decoding POST data from the browser body
app.use(express.static(__dirname + '/public'));  				// Route all other GET requests to serve static files from a directory named "public"
app.listen(8080, () => console.log(`listening on port 8080`));  // Start the server, listen on port 8080 for incoming HTTP requests

slib.initalization(products)


// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
// Sends a message to the server console for troubleshooting and monitoring normal activity
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
});

// Add a new route for handling protected routes
app.get('/protected', function(request, response) {
	// Check if the user is logged in
	if (request.session.loggedIn) {
		response.send('Protected content');
	} else {
		response.send('Access denied');
	}
});

// Define a route for handling a GET request to a path that matches "./products.js"
app.get('/headers.js', function(request, response, next) {
	logged_user = { name: "Log In" };

	if (request.session.user) {
		logged_user = request.session.user;
	}

	const categories = slib.getProductCategories(products)
	let js_header = `
		let cart = JSON.parse(localStorage.getItem("myCart"));
		if (cart != null) {
			let aggregation = 0;
			for (const [key, value] of Object.entries(cart)) {
				aggregation += Object.values(value).reduce((sum, cur) => sum + cur, 0);
			}
		
			console.log(aggregation)
			document.getElementById("cart_total").innerHTML = "" + aggregation
		}
			
		document.getElementById("user_login").innerHTML = "${logged_user["name"]}"

		const categories = ${JSON.stringify(categories)}
		console.log(categories)
		console.log('testtesttest');
		const nav_bar = document.getElementById("sticky-navbar");
		for (let i = 0; i < categories.length; i++) {
			const li  = document.createElement("li");
			li.innerHTML = '<a class="nav-link mx-3 highlight" href="/products_display.html?category=' + categories[i] + '">' + categories[i] + '</a>'
			nav_bar.appendChild(li);
		}

		`;

	if (request.session.user) {
		js_header += `document.getElementById("user_link").href = "/logout.html"`;
	}

	response.type('.js');
	response.send(js_header);
	// console.log(products_str);
});

app.get('/products.js', function(req, res, next) {
	// Send the response as JavaScript
	res.type('.js');
	
	// Create a JavaScript string (products_str) that contains data loaded from the products.json file
	let products_str = `let products = ${JSON.stringify(products)};`;
	
	// Send the string in response to the GET request
	res.send(products_str);
	console.log(products_str);
});

// Route for handling POST requests to "/add_to_cart"
app.post("/add_to_cart", function(request, response) {
	// Call the add_to_cart function and pass the request and response objects
	console.log(request.body)
	// slib.addToCart(request.body);
	// add_to_cart(request.body, response);



});

// Route for handling POST requests to "/register"
app.post("/register", function(request, response) {
	let query_requirements = ["full_name", "email", "password", "repeat_password"]
	let POST = request.body;

	console.log(POST);

	// Check if required fields are present
	query_requirements.forEach((element) => {
		if (!POST.hasOwnProperty(element)){
			console.log("Missing Query(s)");
			response.redirect(`./register.html?error=missing_${element}`);
			return;
		}
	});

	// Validate email
	if (!slib.isValidEmail(POST["email"])) {
		response.redirect('./register.html?error=invalid_email');
		return;
    }

	// Validate password
	if (!slib.isValidPassword(POST["password"])) {
		response.redirect('./register.html?error=invalid_password');
		return;
    }

    // Check if passwords match
    if (!slib.doPasswordsMatch(POST["password"], POST["repeat_password"])) {
        response.redirect('./register.html?error=password_mismatch');
        return;
    }

    // Validate full name
    if (!slib.isValidFullName(POST["full_name"])) {
        response.redirect('./register.html?error=invalid_fullname');
        return;
    }

	// Read user data from a JSON file
	readFile("./user_data.json", "utf8", (err, json) => {
		if (err == null) {
			console.log(json);
			all_users = JSON.parse(json);

			// If the user already exists
			if (all_users.hasOwnProperty(POST["email"].toLowerCase())) {
				response.redirect('./register.html?error=existing_email');
				return;
			}
			// If the user doesn't exist
			else {
				all_users[POST["email"].toLowerCase()] = {
					name: POST["full_name"],
					password: POST["password"],
				};

				// Write the updated user data to the JSON file
				writeFile("./user_data.json", JSON.stringify(all_users, null, 2), (err) => {
					if (err) {
						console.log("User Save Error");
						response.redirect('./register.html?error=server_error');
					}
				});

				// Add user's name to items and process the purchase
				// items["name"] = all_users[POST["email"].toLowerCase()]["name"];
				// slib.process_purchase(items, response);
				response.redirect("./login.html");

				return;
			}
		}
	});
});

// // Route for handling POST requests to "/process_login"
// app.post("/process_login", function(request, response) {
// 	let POST = request.body;
// 	let items = slib.parse_items(POST, ["email", "password", "error"]);
// 	console.log(items);
// 	console.log(POST);

// 	// Read user data from a JSON file
// 	readFile("./user_data.json", "utf8", (err, json) => {
// 		if (err == null) {
// 			console.log(json);
// 			all_users = JSON.parse(json);

// 			if (all_users.hasOwnProperty(POST["email"].toLowerCase()) && all_users[POST["email"]]["password"] == POST["password"]) {
// 				// Add user's name to items and process the purchase
// 				items["name"] = all_users[POST["email"].toLowerCase()]["name"];
// 				slib.process_purchase(items, response);
// 			}
// 			else {
// 				// Redirect to the login page with query parameters
// 				response.redirect("./login.html?error=incorrect_info&" + qs.stringify(items));
// 			}
// 		}
// 	});
// });

// Route for forwarding to the register page
app.post("/forward_to_register_page", function(request, response) {
	let POST = request.body;
	console.log(POST)
	response.redirect("./register.html?" + qs.stringify(POST));
});

// Route for forwarding to the thanks page
app.post("/forward_to_thanks_page", function(request, response) {
	let POST = request.body;
	console.log(POST)
	response.redirect("./thankspage.html?" + qs.stringify(POST));
});

// Route for purchasing while logged in
app.post("/purchase_login_check", function(request, response) {
	let POST = request.body;
	console.log(POST)

	console.log(request.session.user);
	if (request.session.user) {
		console.log("Session Found")
		response.send({ user: request.session.user });
		// TODO: PROCESS CHECKOUT()
		// response.send(`Name: ${request.session.user.name}`);
	} else {
		console.log("No Session")
		response.send({ user: null });
		// response.send('No session found');
	}

	// response.redirect("./login.html");
});

// Route for processing a purchase
// app.post("/process_purchase", function(request, response) { 
// 	// Extract the content of the request body
// 	let POST = request.body;
// 	console.log(POST)
// 	slib.process_purchase(POST, response);
// });



  
// // Access session variable
// app.get('/get-session', (request, response) => {
// 	if (request.session.user) {
// 		console.log("Session Found")
// 		response.send({ user: request.session.user });
// 	} else {
// 		console.log("No Session")
// 		response.send({ user: null });
// 	}
// });

// Add a new route for handling login requests
app.post('/user_login', function(request, response) {
	// const { username, password } = request.body;
	let POST = request.body; 

	readFile("./user_data.json", "utf8", (err, json) => {
		if (err == null) {
			console.log(json);
			all_users = JSON.parse(json);

			if (all_users.hasOwnProperty(POST["email"].toLowerCase()) && all_users[POST["email"]]["password"] == POST["password"]) {
				request.session.user = { name: all_users[POST["email"]]["name"] };
				response.redirect("./cart.html");
			}
			else {
				response.redirect("./login.html?error=incorrect_info");
			}
		}
	});

	// if (username === 'admin' && password === 'password') {
	// 	// request.session.loggedIn = true;
	// 	request.session.user = { username: username };

	// 	response.send('Session set, Login successful');
	// } else {
	// 	response.send('Invalid username or password');
	// }
});

app.post('/user_logout', (req, res) => {
	req.session.destroy(err => {
	  if (err) {
		// handle error case here
		res.status(500).send('Error logging out');
	  } else {
		// Optionally, you can clear the client-side cookie as well
		res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name
		res.send('Logged out successfully');
		console.log("Session Destroyed")
	  }
	});
});