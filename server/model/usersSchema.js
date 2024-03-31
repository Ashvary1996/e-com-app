const mongoose = require("mongoose");
const UserSchema = mongoose.Schema;
const validator = require("validator");

const User = new UserSchema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your Last Name "],
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Not a valid email address",
    },
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: { type: String },
    url: { type: String },
  },
  sign_up_Date: {
    type: String,
    default: Date(),
  },
});

const Usermodel = mongoose.model("Users", User);
module.exports = Usermodel;
