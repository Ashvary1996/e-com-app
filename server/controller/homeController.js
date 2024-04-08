const Usermodel = require("../model/usersSchema");
const jwt = require("jsonwebtoken");
const { sendToken } = require("../utils/jwtToken");

// exports.homeFn = async (req, res) => {
//   let token = req.headers.token;
//   if (!token) {
//     return res.send("Unauthorised no Token");
//   }
//   const secret = process.env.JWT_SECRET;
//   let jwtUser;
//   try {
//     jwtUser = await jwt.verify(token.split(" ")[1], secret);
//     res.send(jwtUser);
//   } catch (error) {
//     return res.status(400).json("invalid token");
//   }

//   if (!jwtUser) {
//     return res.send("Unauthorised ");
//   }
//   //   let currentUser = await Usermodel.aggregate().project({
//   //     password: 0,
//   //     Date: 0,
//   //     __v: 0,
//   //   });
//   let currentUser = await Usermodel.find({ email: jwtUser.email });
//   res.send(currentUser);
//   let j = req.headers;

//   res.json({ headers: j, currentUser });
// };

const homeFn = async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "user need to log in" });
  }
};

module.exports = { homeFn };
