const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const mongo_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/demo", (req, res) => res.send("Hello World"));
app.use("/user", require("./routes/SignUpRoute"));
app.use("/user", require("./routes/LogInRoute"));
app.use("/user", require("./routes/HomeRoute"));
app.use("/user", require("./routes/ForgotPassRoute"));

app.listen(port, () => console.log(`App listening on port ${port}!`));

mongoose
  .connect(mongo_URI)
  .then(() => {
    console.log("Connected to Database Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
