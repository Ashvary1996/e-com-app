const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

route.post("/login", async (req, res) => {
  try {
    if (!req.body.email) res.send("email Required");
    else if (!req.body.password) res.send("Password Required");
    else {
      let user = await Usermodel.findOne({
        email: req.body.email,
      });
      if (user) {
        let isMatch = await bcrypt.compare(req.body.password, user.password);

        if (isMatch) {
          
          let payload = {
            id: user._id,
            email: req.body.email,
          };
          const secret = process.env.JWT_SECRET;
          const token = await jwt.sign(payload, secret, {
            expiresIn: 31556926,
          });
          res.send({
            status: true,
            detail: "Logged In Success",
            user: user,
            token: token,
          });
        } else {
          res.send({
            status: false,
            detail: "Logged In Failed / Wrong Password",
          });
        }
      } else {
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
