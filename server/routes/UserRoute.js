const express = require("express");
const route = express.Router();
const { signUpFn } = require("../controller/signUpController");
const { logInFn } = require("../controller/logInController");
const {
  forgotPassFn,
  resetPassFn,
} = require("../controller/forgotPassController");

route.post("/signup", signUpFn);
route.post("/login", logInFn);
route.post("/forgotPass", forgotPassFn);
route.post("/reset", resetPassFn);

module.exports = route;
