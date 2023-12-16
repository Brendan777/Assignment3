// This function asks the server for a "service" and converts the response to text. (From Dr.Port)
function loadJSON(service, callback) {   
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

// This function makes a navigation bar from a products object
function nav_bar(products_key, products) {
    // This makes a navigation bar to other product pages
    for (let products_key in products) {
	// The string template in the document.write is writing out the link to your product pages
	// Edit the href link to be the name of the file you use to display your products
	// The products_key is the name of your different product categories
        document.write(`<a href='/products_display.html?products_key=${products_key}'>${products_key}<a>`);
    }
}