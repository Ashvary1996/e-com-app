const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
const connectToDb = require("./dbConnector");
const { sendToken } = require("./utils/jwtToken");

///////////////////////

/////////////////////////
const app = express();
const port = process.env.PORT || 5000;

// .................................................................

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// .................................................................

app.use("/demo", (res) => res.send("Hello World"));

app.use("/user", require("./routes/UserRoute"));
app.use("/home", require("./routes/HomeRoute"));
app.use("/product", require("./routes/ProductRoute"));
app.use("/user/cart", require("./routes/CartRoute"));
app.use("/order", require("./routes/OrderRoute"));

// .................................................................

app.listen(port, () => console.log(`App listening on port: ${port}!`));
connectToDb();

// .................................................................
module.exports = app;
