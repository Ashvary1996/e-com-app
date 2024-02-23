const express = require("express");
const route = express.Router();

const Product = require("../model/productSchema");
const CartModel = require("../model/cartSchema");
const UserSchema = require("../model/usersSchema");
const apiProducts = require("../controller/apiProducts");
const addProduct = require("../controller/addProductController");
const allProducts = require("../controller/getAllProductsController");

// Route to add all Products from api
route.post("/addProductFromApi", apiProducts);

// Route to add a new single product
route.post("/addProduct", addProduct);

// Route to get all products
route.get("/allProducts", allProducts);

// .................................
// Route to add a product to the cart
route.post("/cart", async (req, res) => {
  const { userId, userName, productId } = req.body;

  try {
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({
        user: userId,
        userName: userName,
        products: [productId],
      }); // Initialize with productId in array
    } else {
      // Add the productId to the cart's products array
      cart.products.push(productId);
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Route to get a product Items from cart
route.post("/getCartItems", async (req, res) => {
  const { userId, userName, productId } = req.body;
  // ...........................................................................
  try {
    let userCart = await CartModel.find({ user: userId });
    const { userName, products } = userCart[0];
    const items = [];
    products.map(async (elem) => {
      const item = await Product.find({ _id: String(elem) });
      items.push(elem);
    });
    // ...........................................................................

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = route;
