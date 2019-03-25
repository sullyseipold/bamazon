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
var selectedProduct = {};
var addQuantity = 0;
var menuOptions = [
    {
        name: "View Products for Sale",
        value: "viewProducts"
    },
    {
        name: "View Low Inventory",
        value: "lowInventory"
    },
    {
        name: "Add to Inventory",
        value: "addInventory"
    },
    {
        name: "Add New Product",
        value: "addProduct"
    }
]

function viewProducts() {
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

        connection.end();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        const table = cTable.getTable(res);
        console.log(table);

        res.map(item => {
            var obj = {};

            obj["name"] = JSON.stringify(`${item.product_name}, id: ${item.item_id}`);
            obj["value"] = item;
            productChoices.push(obj);

        });

        connection.end();
    });
}

function addInventory() {

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            const table = cTable.getTable(res);
            console.log(table);

            res.map(item => {
                var obj = {};

                obj["name"] = JSON.stringify(`product: ${item.product_name} || stock quantity: ${item.stock_quantity}`);
                obj["value"] = item;
                productChoices.push(obj);

            });

            inquirer.prompt([
                {
                    type: "list",
                    name: "inventory",
                    message: `Select product to add`,
                    choices: productChoices
                }
            ]).then(function (selection) {

                selectedProduct = selection.inventory;
                selectQuantity();

            });
        });
    });
}

function selectQuantity() {

    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: `How many ${selectedProduct.product_name}'s would you like add?`,
            validate: function (value) {
                var reg = /^\d+$/;
                return reg.test(value) || "Quantity should be a number!";
            }
        }
    ]).then(function (selection) {

        addQuantity = selection.quantity;
        console.log('quantity to add: ', addQuantity);

        var quantity = parseInt(selectedProduct.stock_quantity) + parseInt(addQuantity);
        updateProduct(selectedProduct, quantity);

    });
}

function updateProduct(product, quantity) {

    connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: quantity
        },
        {
            id: product.id
        }],
        function (err, res) {
            if (err) {
                throw err
            }
            else {
                console.log(`Product quantity updated! \n${res.affectedRows} product rows updated`);
                connection.end();
            }
        });
}

function addProduct() {

    inquirer.prompt([
        {
            name: "name",
            message: `Enter the product name`
        }, {
            name: "itemId",
            message: `Enter the item id`,
            validate: function (value) {
                var reg = /^\d+$/;
                return reg.test(value) || "item id should be a number!";
            }
        }, {
            name: "department",
            message: `Enter the department name`
        }, {
            name: "price",
            message: `Enter the product price`,
            validate: function (value) {
                var reg = /^\$?(([1-9]\d{0,2}(\d{3})*)|0)?\.\d{1,2}$/;
                return reg.test(value) || "Enter valid price!!!";
            }
        }, {
            name: "quantity",
            message: `Enter product quantity`,
            validate: function (value) {
                var reg = /^\d+$/;
                return reg.test(value) || "Quantity should be a number!";
            }
        }

    ]).then(function (answers) {
        var product = {
            item_id: answers.itemId,
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        }

        insertProduct(product);
    });
}

function insertProduct(product) {

    connection.connect(function (err) {
        if (err) throw err;

        connection.query(
            "INSERT INTO products SET ?",
            product,
            function (err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                connection.end();
            }
        );
    })
}



function mainMenu() {

    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: `Select an option`,
            choices: menuOptions
        }
    ]).then(function (selection) {

        var menuSelection = selection.option
        console.log('menu option: ', menuSelection);

        switch (menuSelection) {
            case "viewProducts":
                viewProducts();
                break;

            case "lowInventory":
                viewLowInventory();
                break;

            case "addInventory":
                addInventory();
                break;

            case "addProduct":
                addProduct();
                break;

            default:
            // code block
        }
    });
}

mainMenu();