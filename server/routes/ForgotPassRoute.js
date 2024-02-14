const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

route.post("/forgotPass", async (req, res) => {
  try {
    if (!req.body.email) res.send("email Required");
    else {
      let user = await Usermodel.findOne({ email: req.body.email });
      if (user) {
        res.send({
          status: true,
          detail: "Email Found",
          user: user,
        });
      } else {
        res.send({
          status: "Not Found",
          detail: "User with this email Not Found",
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = route;
