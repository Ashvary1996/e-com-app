const express = require("express");
const route = express.Router();
const { handelPayment, paymentVerification } = require("../controller/paymentController");
 

route.post("/create-order", handelPayment);
route.post("/verify_payment", paymentVerification);

module.exports = route; 
 