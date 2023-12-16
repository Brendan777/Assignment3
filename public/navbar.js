let params = (new URL(document.location)).searchParams;

let products_key = "Apparel";

if (params.has('products_key')) {
    products_key = params.get('products_key');
}

let shopping_cart;

let totalItemsInCart = 0;

for (let productKey in shopping_cart) {
    let productTotalQuantity = productQuantities.reduce((accumulator, currentQuantity) => accumulator + currentQuantity);

    totalItemsInCart += productTotalQuantity;
}

// Add event listener to check for user cookie
document.addEventListener('DOMContentLoaded', () => {
    const userCookie = getCookie('user');
    if (userCookie) {
        console.log('User cookie found:', userCookie);
        // User is logged in, show logout button and user's name
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', () => {
            // Remove the user cookie
            deleteCookie('user');
            console.log('User logged out');
        });
        document.getElementById('navbar').appendChild(logoutButton);

        // Display user's name
        const userName = document.createElement('span');
        userName.textContent = `Welcome, ${userCookie}`;
        document.getElementById('navbar').appendChild(userName);
    } else {
        // User is not logged in, show login button
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', () => {
            // Perform login logic here
            // Set the user cookie
            setCookie('user', 'user123', 7); // Set cookie for 7 days
            console.log('User logged in');
        });
        document.getElementById('navbar').appendChild(loginButton);
    }
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieEntries = decodedCookie.split(';');
    for (let i = 0; i < cookieEntries.length; i++) {
        let cookie = cookieEntries[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function updateCartTotal() {
    // Get the cart total element
    const cartTotalElement = document.getElementById('cart-total');

    // Get the cart total
    const cartTotal = cartTotalElement.textContent;

    // Update the cart total element
    cartTotalElement.textContent = cartTotal;
}


// Add CSS class to navbar element
const navbar = document.getElementById('navbar');
navbar.classList.add('custom-navbar');


document.addEventListener('DOMContentLoaded', function() {
    // Fetch the product JSON
    fetch('path_to_your_product_json.json')
      .then(response => response.json())
      .then(data => {
        // Get the navbar container
        const navbarContainer = document.getElementById('nav_container');
  
        // For each category
        data.forEach(categoryObj => {
          // Create a new a element for the navbar tab
          const a = document.createElement('a');
  
          // Set the href attribute and inner text
          a.href = `${categoryObj.category}.html`;
          a.innerText = categoryObj.category;
          a.className = "nav-link mx-3 highlight"; // Add your class names here
  
          // Append the a to the navbar container
          navbarContainer.appendChild(a);
        });
      });
  });






// // Track active users
// function trackActiveUsers() {
//     // Send a request to the server to track the active user
//     fetch('/track-active-user', {
//         method: 'POST',
//         body: JSON.stringify({ userId: 'user123' }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         // Handle the response from the server
//         if (response.ok) {
//             console.log('Active user tracked successfully');
//         } else {
//             console.error('Failed to track active user');
//         }
//     })
//     .catch(error => {
//         console.error('Error occurred while tracking active user:', error);
//     });
// }

// // Get users
// function getUsers() {
//     // Send a request to the server to get the list of users
//     return fetch('/get-users')
//         .then(response => response.json())
//         .then(data => {
//             // Process the response data
//             return data.users;
//         })
//         .catch(error => {
//             console.error('Error occurred while getting users:', error);
//             return [];
//         });
// }

// // Call the getUsers function to get the list of users
// getUsers()
//     .then(users => {
//         console.log('Users:', users);
//         console.log('Number of active users:', users.length);
//         // Show the number of users on the site
//         document.getElementById('users-response').textContent = `Number of users: ${users.length}`;
//     });

// // Call the trackActiveUsers function to track the active user
// trackActiveUsers();


