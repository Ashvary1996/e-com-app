const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

route.post("/signup", async (req, res) => {
  try {
    if (!req.body.firstName) res.send("firstName Required");
    else if (!req.body.lastName) res.send("lastName Required");
    else if (!req.body.email) res.send("email Required");
    else if (!req.body.phoneNumber) res.send("phoneNumber Required");
    else if (!req.body.password) res.send("Password Required");
    else {
      let user = await Usermodel.findOne({ email: req.body.email });
      if (user) {
        res.send({
          status: false,
          detail: "Already a User",
          user: user,
        });
      }

      const newUser = new Usermodel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      });

      newUser
        .save()
        .then((user) =>
          res.send({ status: true, detail: "User Saved", user: user })
        )
        .catch((err) => console.log(err, "problem in saving to database"));
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = route;
