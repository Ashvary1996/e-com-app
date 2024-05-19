const jwt = require("jsonwebtoken");

const sendToken = (user, res, msg) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1w" });

  const cookieOptions = {
    // expiresIn: "7d",
    expires: new Date(Date.now() + 9000000),
    httpOnly: true,
    secure: true, // Ensure this is true if using HTTPS
    sameSite: 'None' // Important for cross-site cookies
  };

  res.cookie("token", token, cookieOptions);

  res.json({
    success: true,
    message: msg,
    userId: user._id,
    user,
    token,
  });
  // res.cookie("usercookieOne", token, {
  //   expires: new Date(Date.now() + 9000000),
  //   httpOnly: true,
  // });
  // const result = {
  //   success: true,
  //   message: msg,
  //   userId: user._id,
  //   user,
  //   token,
  //   msg:"My custom msgggggggggggg"
  // };
  // res.status(200).json(result);
};

module.exports = { sendToken };
