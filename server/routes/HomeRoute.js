const express = require("express");
const route = express.Router();

const { homeFn } = require("../controller/homeController");
const { isAuthenticatedUser } = require("../middleware/auth");

// route.get("/", homeFn);
route.get("/", isAuthenticatedUser, homeFn);

module.exports = route;
