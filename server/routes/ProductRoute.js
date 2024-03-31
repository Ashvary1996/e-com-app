const express = require("express");
const route = express.Router();

const {
  createProduct,
  getAllProducts,
  updateProduct,
  apiProducts,
  getSingleProduct,
  deleteProduct,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth");

// Route to add all Products from api
route.put("/addProductFromApi", apiProducts);

// Route to add a new Single product
route.put(
  "/addProduct",
  isAuthenticatedUser,
  authorizedRole("admin"),
  createProduct
);

// Route to get all products
route.get("/getallProducts", getAllProducts);
// route.get("/getallProducts",  getAllProducts);

// Route to update a single Products
route.put(
  "/updateProduct/:id",
  isAuthenticatedUser,
  authorizedRole("admin"),
  updateProduct
);

// Route to delete a Product.
route.delete(
  "/deleteProduct/:id",
  isAuthenticatedUser,
  authorizedRole("admin"),
  deleteProduct
);

// ................................ .
// Route to get Single products Details
route.get("/singleProduct", getSingleProduct);

// .................................

module.exports = route;
