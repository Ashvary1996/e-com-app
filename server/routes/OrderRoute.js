const express = require("express");
const {
  newOrder,
  getAllOrders,
  getmyOrder,
  getUserOrders,
  updateOrder,
  getSingleOrder,
  deleteOrder,
  handleRazorpayCallback,
  getOrderByPayId,
} = require("../controller/orderController");
const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth");
const route = express.Router();
//////////////
route.post("/payment/create-order", isAuthenticatedUser, newOrder);
route.post("/razorpay/callback", handleRazorpayCallback);
/////////
route.get("/getAllOrders", isAuthenticatedUser, getAllOrders);

route.get("/getOrderByPayId/:payId", getOrderByPayId);

route.get("/getmyOrders", isAuthenticatedUser, getmyOrder);
//admin
route.get(
  "/admin/getSingleOrder/:orderId",
  isAuthenticatedUser,
  getSingleOrder
);
route.get(
  "/admin/getUserOrders/:userId",
  isAuthenticatedUser,
  authorizedRole("admin"),
  getUserOrders
);
route.put(
  "/admin/updateOrder/:orderId",
  isAuthenticatedUser,
  authorizedRole("admin"),
  updateOrder
);
route.delete(
  "/admin/deleteOrder/:orderId",
  isAuthenticatedUser,
  authorizedRole("admin"),
  deleteOrder
);

module.exports = route;
 