const express = require("express");
const route = express.Router();

const { homeFn } = require("../controller/homeController");
const allProducts = require("../controller/getAllProductsController");

route.get("/home", homeFn );
// route.get("/home", allProducts);

module.exports = route;
