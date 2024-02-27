const express = require("express");
const route = express.Router();
const {
  addToCart,
  getCartItems,
  updateCart,
  delCartItem,
} = require("../controller/cartController");

// Route for addToCart
route.post("/cart", addToCart);

// Route to get a product Items from cart
route.post("/getCartItems", getCartItems);

// Route to update the products from cart
route.post("/updateCartItems", updateCart);

// Route to remove the single Products from cart
route.post("/removeCartItems", delCartItem);

module.exports = route;
