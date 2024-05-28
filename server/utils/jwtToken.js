const jwt = require("jsonwebtoken");

const sendToken = (user, res, msg) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1w" });

  const cookieOptions = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expire in Two Days
    httpOnly: true,
    secure: true, // Ensure this is true if using HTTPS
    sameSite: "None", // Important for cross-site cookies
  };

  res.cookie("token", token, cookieOptions);

  res.json({
    success: true,
    message: msg,
    userId: user._id,
    user,
    token,
  });
};

module.exports = { sendToken };
