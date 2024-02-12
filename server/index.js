const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const mongo_URI = process.env.MONGO_URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/demo", (req, res) => res.send("Hello World"));
app.use("/user", require("./routes/SignUpRoute"));
app.use("/user", require("./routes/LogInRoute"));
app.use("/user", require("./routes/HomeRoute"));

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
