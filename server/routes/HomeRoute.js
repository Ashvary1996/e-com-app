const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

const jwt = require("jsonwebtoken");

route.get("/home", async (req, res) => {
  let token = req.headers.token;
  if (!token) {
    return res.send("Unauthorised no Token");
  }
  const secret = process.env.JWT_SECRET;
  let jwtUser;
  try {
    jwtUser = await jwt.verify(token.split(" ")[1], secret);
    // res.send(jwtUser);
  } catch (error) {
    return res.status(400).json("invalid token");
  }

  if (!jwtUser) {
    return res.send("Unauthorised ");
  }
  //   let currentUser = await Usermodel.aggregate().project({
  //     password: 0,
  //     Date: 0,
  //     __v: 0,
  //   });
  let currentUser = await Usermodel.find({ email: jwtUser.email });
  // res.send(currentUser);
  let j = req.headers;
  res.json({headers:j,currentUser});
});

module.exports = route;
