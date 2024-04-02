const express = require("express");
const route = express.Router();

const {
  signUpFn,
  logInFn,
  getallUsers,
  forgotPassFn,
  resetPassFn,
  logOutFn,
  updatePassFn,
  updateProfile,
  getSingleUser,
  deleteUser,
} = require("../controller/userController");

const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth");

route.post("/signup", signUpFn);
route.post("/login", logInFn);
route.post("/logout", logOutFn);

route.post("/forgotPass", forgotPassFn);
route.post("/reset", resetPassFn);
route.post("/updatePassword", updatePassFn);

route.put("/updateProfile", isAuthenticatedUser, updateProfile);

route.get(
  "/getusers",
  isAuthenticatedUser,
  authorizedRole("admin"),
  getallUsers
);
route.put(
  "/admin/getSingleUser",
  isAuthenticatedUser,
  authorizedRole("admin"),
  getSingleUser
);
route.delete(
  "/admin/deleteUser/:userId",
  isAuthenticatedUser,
  authorizedRole("admin"),
  deleteUser
);

module.exports = route;
