var mysql = require("mysql");
var cTable = require('console.table');
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

var productChoices = [];
var productToPurchase = {};
var quantityToPurchase = 0;

function customerOrder() {

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            const table = cTable.getTable(res);
            console.log(table);

            res.map(item => {
                var obj = {};

                obj["name"] = JSON.stringify(`${item.product_name}, id: ${item.item_id}`);
                obj["value"] = item;
                productChoices.push(obj);

            });

            // connection.end();

            inquirer.prompt([
                {
                    type: "list",
                    name: "purchase",
                    message: `Select an item to purchase`,
                    choices: productChoices
                }
            ]).then(function (selection) {

                productToPurchase = selection.purchase;
                console.log('you have purchased: ', productToPurchase);
                selectQuantity();

            });
        });
    });
}

customerOrder();

function getAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        const table = cTable.getTable(res);
        console.log(table);

        connection.end();
    });
}

function selectQuantity() {

    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: `How many ${productToPurchase.product_name}'s would you like purchase?`,
            validate: function (value) {
                var reg = /^\d+$/;
                return reg.test(value) || "Quantity should be a number!";
            }
        }
    ]).then(function (selection) {

        quantityToPurchase = selection.quantity;
        console.log('quantity to purchase: ', quantityToPurchase);
        purchaseProduct();

    });
}

function purchaseProduct() {

    if (!validatePurchase()) {
        console.log(`Insufficient quantity! There are only ${productToPurchase.stock_quantity} available`)
        connection.end();
    }
    else {
        updateProduct(productToPurchase, quantityToPurchase);
    }
}

function validatePurchase() {
    return productToPurchase.stock_quantity >= quantityToPurchase
}

function updateProduct(product, quantity) {

    var inStock = product.stock_quantity - quantity;

    var cost = product.price * quantity;

    connection.query("UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: inStock
    },
    {
        id: product.id
    }],
    function (err, res) {
        if (err) {
            throw err
        }
        else {
            console.log(`\nProduct purchased! \nTotal Cost: $${cost}\n`);
            connection.end();
        }
    });
}