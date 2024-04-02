const mongoose = require("mongoose");
const UserSchema = mongoose.Schema;
const validator = require("validator");

const User = new UserSchema({
  firstName: {
    type: String,
    required: [true, "Please Enter Your First Name "],
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your Last Name "],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your E-mail"],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Not a valid email address",
    },
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please Enter Your Phone-Number"],
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
