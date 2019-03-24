# bamazon


#bamazonCustomer.js

The `bamazonCustomer.js` application requires that there be a mySql database named 'bamazon' containing a table named `products` hosted locally to where the application is running.  The application does the follwing:

1.  Outputs a table containing all available products to the terminal/bash window.

2.  Prompts the user to select a product to purchase from a list or products.

3.  Prompts the user to enter a quatity of products to purchase.

4. Once the user has placed the order, the application checks if the store has enough of the product to meet the users's request.

   * If not, the application log the phrase `Insufficient quantity!` and prevents the order from going through.

8. However, if the store _does_ have enough of the product, the application fulfills the user's order.
   * The database is updated to reflect the remaining quantity.
   * Once the update goes through, the total cost of the purchase is displayed.


click the link below to see a video demonstrating `bamazonCustomer.js` functionality
 < >

#bamazonManager.js

The `bamazonCustomer.js` application requires that there be a mySql database named 'bamazon' containing a table named `products` hosted locally to where the application is running.  The application does the follwing:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a user selects `View Products for Sale`, the app outputs a table containing all available products.

  * If a user selects `View Low Inventory`, then it lists all items with an inventory count lower than five.

  * If a user selects `Add to Inventory`, the app displays a prompt that will let the user "add more" of any item currently in the store.

  * If a user selects `Add New Product`, it allows the user to add a completely new product to the store.

  click the link below to see a video demonstrating `bamazonManager.js` functionality
 < >
