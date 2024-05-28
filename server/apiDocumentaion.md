API Documentation
Overview
This documentation outlines the API endpoints, middleware, and models utilized in the project. It's built with Express and MongoDB, featuring routes for managing users, products, orders, and carts.

Table of Contents
User Authentication and Management API Documentation
Cart Management API Documentation
Order Management API Documentation
Product Management API Documentation
User Authentication and Management API Documentation
This API facilitates user management and authentication, including registration, login, logout, password reset, and profile updates.

Endpoints
User Registration

Method: POST
URL: /signup
Description: Registers a new user.
Request Body:
json
Copy code
{
"firstName": "string",
"lastName": "string",
"email": "string",
"phoneNumber": "string",
"password": "string"
}
Responses:
200 OK: User successfully registered.
400 Bad Request: Missing required fields.
409 Conflict: User already exists.
User Login

Method: POST
URL: /login
Description: Logs in an existing user.
Request Body:
json
Copy code
{
"email": "string",
"password": "string"
}
Responses:
200 OK: User successfully logged in.
400 Bad Request: Missing email or password.
404 Not Found: User not found.
401 Unauthorized: Incorrect password.
User Logout

Method: POST
URL: /logout
Description: Logs out the current user.
Responses:
200 OK: User successfully logged out.
Get All Users

Method: GET
URL: /users
Description: Retrieves a list of all users.
Responses:
200 OK: Successfully retrieved the list of users.
500 Internal Server Error: Error retrieving users.
Update User Role

Method: PUT
URL: /users/role
Description: Updates the role of a specified user.
Request Body:
json
Copy code
{
"findUserId": "string",
"updateRole": "string"
}
Responses:
200 OK: Successfully updated user role.
500 Internal Server Error: Error updating user role.
Forgot Password

Method: POST
URL: /forgot-password
Description: Sends a password reset link to the user's email.
Request Body:
json
Copy code
{
"email": "string"
}
Responses:
200 OK: Password reset link sent.
404 Not Found: User not found.
Reset Password

Method: POST
URL: /reset-password
Description: Resets the user's password using the provided token.
Request Body:
json
Copy code
{
"token": "string",
"newPassword": "string",
"confirmPassword": "string"
}
Responses:
200 OK: Password successfully reset.
400 Bad Request: Passwords do not match or do not meet length requirement.
404 Not Found: User not found.
500 Internal Server Error: Invalid or expired token.
Update Password

Method: PUT
URL: /update-password
Description: Updates the user's password while logged in.
Request Body:
json
Copy code
{
"oldPassword": "string",
"newPassword": "string",
"confirmPassword": "string"
}
Responses:
200 OK: Password successfully updated.
400 Bad Request: Passwords do not match, old password is incorrect, or new password does not meet length requirement.
404 Not Found: User not found.
500 Internal Server Error: Error updating password.
Update Profile

Method: PUT
URL: /profile
Description: Updates the user's profile information.
Request Body:
json
Copy code
{
"firstName": "string",
"lastName": "string",
"email": "string",
"phoneNumber": "string"
}
Responses:
200 OK: Profile successfully updated.
400 Bad Request: User ID not provided.
500 Internal Server Error: Error updating profile.
Update Profile by Admin

Method: PUT
URL: /admin/update-profile
Description: Admin updates a user's profile information.
Request Body:
json
Copy code
{
"userID": "string",
"firstName": "string",
"lastName": "string",
"email": "string",
"phoneNumber": "string"
}
Responses:
200 OK: Profile successfully updated.
400 Bad Request: User ID not provided by admin.
500 Internal Server Error: Error updating profile.
Delete User

Method: DELETE
URL: /users/
Description: Deletes a specified user.
Request Parameters:
userId: ID of the user to be deleted.
Responses:
200 OK: User successfully deleted.
404 Not Found: User not found.
500 Internal Server Error: Error deleting user.
Error Handling

Errors are returned as JSON objects with the following structure:
json
Copy code
{
"message": "string",
"error": "string"
}
Cart Management API Documentation
This API allows for managing shopping carts, including adding, updating, and removing items from the cart.

Endpoints
Add to Cart
Method: POST
URL: /cart/add
Description: Adds a product to the user's cart.
Request Body:
json
Copy code
{
"productId": "string"
}
Responses:
201 Created: Product added to cart successfully.
400 Bad Request: Product ID not available.
500 Internal Server Error: Error adding to cart.

Get Cart Items

Method: GET
URL: /cart/items
Description: Retrieves the items in the user's cart.
Responses:
200 OK: Successfully retrieved cart items.
404 Not Found: Cart not found.
500 Internal Server Error: Error retrieving cart items.
Update Cart Item Quantity

Method: PUT
URL: /cart/update
Description: Updates the quantity of a product in the user's cart.
Request Body:
json
Copy code
{
"productId": "string",
"quantity": "number"
}
Responses:
200 OK: Cart item quantity updated successfully.
404 Not Found: Cart or product not found.
500 Internal Server Error: Error updating cart item quantity.
Delete Cart Item

Method: DELETE
URL: /cart/delete
Description: Removes a product from the user's cart.
Request Body:
json
Copy code
{
"productId": "string"
}
Responses:
200 OK: Product removed from cart successfully.
404 Not Found: Cart or product not found.
Clear Cart

Method: DELETE
URL: /cart/clear
Description: Clears all items from the user's cart.
Request Body:
json
Copy code
{
"userId": "string"
}
Responses:
200 OK: Cart cleared successfully.
404 Not Found: Cart not found.
500 Internal Server Error: Error clearing cart.
Order Management API Documentation
This API allows for managing orders, including creating new orders, handling payment callbacks, retrieving orders, and updating order status.

Endpoints
Create New Order

Method: POST
URL: /order/new
Description: Creates a new order.
Request Body:
json
Copy code
{
"contactInfo": {
"phoneNo": "string"
},
"shippingInfo": {
"address": "string",
"city": "string",
"state": "string",
"pinCode": "string"
},
"items": [
{
"title": "string",
"price": "number",
"quantity": "number",
"images": ["string"],
"product_id": "string"
}
],
"totalItems": "number",
"totalPayableAmount": "number"
}
Responses:
201 Created: Order created successfully.
500 Internal Server Error: Error creating order.
Handle Razorpay Callback

Method: POST
URL: /order/razorpay/callback
Description: Handles callback from Razorpay after payment.
Request Body:
json
Copy code
{
"razorpay_order_id": "string",
"razorpay_payment_id": "string",
"amount": "number"
}
Responses:
200 OK: Order status updated successfully.
404 Not Found: Order not found.
500 Internal Server Error: Error handling callback.
Product Management API Documentation
This API allows for managing products, including retrieving, updating, and deleting products, as well as adding, updating, and removing product reviews.

Endpoints
Get All Products

Method: GET
URL: /product/all
Description: Retrieves all products.
Responses:
200 OK: Successfully retrieved all products.
500 Internal Server Error: Error retrieving all products.
Get Single Product

Method: GET
URL: /product/
Description: Retrieves a single product by its ID.
Responses:
200 OK: Successfully retrieved single product.
500 Internal Server Error: Error retrieving single product.
Update Product

Method: PUT
URL: /product/
Description: Updates a product.
Request Body:
json
Copy code
{
// Fields to update...
}
Responses:
200 OK: Successfully updated product.
500 Internal Server Error: Error updating product.
Delete Product

Method: DELETE
URL: /product/
Description: Deletes a product.
Responses:
200 OK: Product deleted successfully.
500 Internal Server Error: Error deleting product.
Add/Update Product Review

Method: POST
URL: /product/review
Description: Adds or updates a review for a product.
Request Body:
json
Copy code
{
"rating": "number",
"comment": "string",
"productId": "string"
}
Responses:
200 OK: Review added/updated successfully.
400 Bad Request: Missing required fields.
401 Unauthorized: User not authenticated.
404 Not Found: Product not found.
500 Internal Server Error: Error processing the review.
Get Product Reviews

Method: GET
URL: /product/reviews/
Description: Retrieves all reviews of a single product.
Responses:
200 OK: Successfully retrieved product reviews.
404 Not Found: Product not found.
500 Internal Server Error: Error retrieving product reviews.
Remove Product Review

Method: DELETE
URL: /product/review
Description: Removes a review from a product.
Request Body:
json
Copy code
{
"productId": "string",
"reviewId": "string"
}
Responses:
200 OK: Review removed successfully.
404 Not Found: Product not found.
500 Internal Server Error: Error removing product review.
