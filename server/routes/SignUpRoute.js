const express = require("express");
const route = express.Router();

route.post("/registration", (req, res) => {
  res.send("Working");
});
module.exports = route;
