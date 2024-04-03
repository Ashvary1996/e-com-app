const jwt = require("jsonwebtoken");

const sendToken = (user, res, msg) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1w" });

  const options = {
    expiresIn: "7d", 
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: msg,
    userId: user._id,
    user,
    token,
  });
};

module.exports = { sendToken };
