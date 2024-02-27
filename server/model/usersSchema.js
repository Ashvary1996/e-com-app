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
    type: String,
    unique: true,
  },
  phoneNumber: {
    require: true,
    type: Number,
  },
  sign_up_Date: {
    default: Date(),
    type: String,
  },
  userType: {
    type: String,
    default: "user"
    
  },
});

const Usermodel = mongoose.model("Users", User);
module.exports = Usermodel;
