const mongoose = require("mongoose");
const UserSchema = mongoose.Schema;

const User = new UserSchema({
  firstName: {
    require: true,
    type: String,
  },
  lastName: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  email: {
    default: Date.now(),
    type: String,
    unique: true,
  },
  phoneNumber: {
    require: true,
    type: Number,
  },
  Date: {
    default: Date.now(),
    type: String,
  },
});

const Usermodel = mongoose.model("Users", User);
module.exports = Usermodel;
