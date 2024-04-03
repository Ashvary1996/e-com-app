const express = require("express");
const route = express.Router();
const {
  addToCart,
  getCartItems,
  updateCart,
  delCartItem,
} = require("../controller/cartController");
const { isAuthenticatedUser } = require("../middleware/auth");

route.post("/addTocart", isAuthenticatedUser, addToCart);
route.get("/getCartItems", isAuthenticatedUser, getCartItems);
route.put("/updateCartItems", isAuthenticatedUser, updateCart);
route.delete("/removeCartItems", isAuthenticatedUser, delCartItem);

module.exports = route;
