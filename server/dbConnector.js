const mongoose = require("mongoose");

const mongo_URI = process.env.MONGO_URI;

const connectToDb = () => {
  mongoose
    .connect(mongo_URI)
    .then(() => {
      console.log("Connected to Database Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectToDb;
