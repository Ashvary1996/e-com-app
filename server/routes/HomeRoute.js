const express = require("express");
const route = express.Router();

const { homeFn } = require("../controller/homeController");

route.get("/home", homeFn);

module.exports = route;
