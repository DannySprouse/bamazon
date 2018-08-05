// NPM packages for project: mysql and inquirer to run program; cli table and colors for organizing/styling data
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table");

// Makes SQL DB connection using credentials
var connection = mysql.createConnection( {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "monkeybrains",
    database: "bamazon_db"
});

// Display list of available items in a table

var displayProducts = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        var table = new Table ({
            head: ['Item Id'.blue.bgYellow, 'Product Name'.blue.bgYellow, 'Department'.blue.bgYellow, 'Current Price'.blue.bgYellow, 'Quantity in Stock'.blue.bgYellow]
        });

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("Please select from the following inventory: ");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
              
        //Lists items in the table
        console.log(table.toString());

        // Asks user to select item ID and quantity from the returned items
        inquirer.prompt([{
            name: "item_id",
            type: "input",
            message: "Please enter the item ID number of the product you'd like to purchase.",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "stock_quantity",
            type: "input",
            message: "How many of these items would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(answer) {

            // This responds to the user input by checking inventory to respond to the order request
            var selectedItemId = answer.item_id - 1
            var selectedProduct = res[selectedItemId]
            var selectedQuantity = answer.stock_quantity

            if (selectedQuantity < res[selectedItemId].stock_quantity) {
                console.log("Your total is: " + res[selectedItemId].price.toFixed(2) * selectedQuantity);
                connection.query("UPDATE products SET ? WHERE ? item_id = ?", [{
                    stock_quantity: res[selectedItemId].stock_quantity - selectedQuantity
                }, {
                   // Something missing here I can't figure out, it is not calculating the update products correctly
                }], 
                function(err, res) {
                    console.log();
                });

            } else {
                console.log("The quantity and item you selected are not available at this time.");
            }
        })
    })
}
// Table loads and asks questions, but once order is complete cannot get table to refresh with reduced inventory

displayProducts(); // Not sure if this should be up inside the if/else or down here, not working either way
