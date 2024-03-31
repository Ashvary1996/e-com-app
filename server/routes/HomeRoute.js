const express = require("express");
const route = express.Router();

const { homeFn } = require("../controller/homeController");

route.get("/", homeFn);

module.exports = route;
