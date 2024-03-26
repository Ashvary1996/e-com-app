const express = require("express");
const route = express.Router();

const {
  apiProducts,
  addProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controller/productController");

// Route to add all Products from api
route.post("/addProductFromApi", apiProducts);

// Route to add a new Single product
route.post("/addProduct", addProduct);

// Route to get all products
route.get("/allProducts", getAllProducts);

// .................................
// Route to get Single products Details
route.post("/singleProduct", getSingleProduct);

// .................................

module.exports = route;
