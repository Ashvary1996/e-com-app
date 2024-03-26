const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const mongo_URI = process.env.MONGO_URI;
// .................................................................
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// .................................................................

app.use("/demo", (req, res) => res.send("Hello World"));
app.use("/user", require("./routes/UserRoute"));
app.use("/user", require("./routes/HomeRoute"));
app.use("/user", require("./routes/ProductRoute"));
app.use("/user", require("./routes/CartRoute"));

// .................................................................
app.listen(port, () => console.log(`App listening on port ${port}!`));

mongoose
  .connect(mongo_URI,)
  .then(() => {
    console.log("Connected to Database Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
