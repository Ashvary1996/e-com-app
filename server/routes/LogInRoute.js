const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

route.post("/login", async (req, res) => {
  try {
    if (!req.body.email) res.send("email Required");
    else if (!req.body.password) res.send("Password Required");
    else {
      let user = await Usermodel.findOne({
        email: req.body.email,
      });
      if (user) {
        if (user.password === req.body.password) {
          res.send({
            status: true,
            detail: "Logged In Success",
            user: user,
          });
        } else {
          res.send({
            status: false,
            detail: "Logged In Failed / Wrong Password",
          });
        }
      } 
      else {
        res.send({
          status: "Not Found",
          detail: "user with this email not found",
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = route;
