const express = require("express");
const route = express.Router();

const {
  createProduct,
  getAllProducts,
  updateProduct,
  apiProducts,
  getSingleProduct,
  deleteProduct,
  productReview,
  getProductReviews,
  removeProductReview,
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

// Route to get Single products Details
route.get("/singleProduct", getSingleProduct);

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
// Route to update Review products
route.put("/review", isAuthenticatedUser, productReview);

route.get(
  "/admin/getProductReviews/:productId",
  isAuthenticatedUser,
  authorizedRole("admin"),
  getProductReviews
);
// Route to remove a Product Review.
route.delete("/removeProductReview", isAuthenticatedUser, removeProductReview);
// .................................

module.exports = route;
