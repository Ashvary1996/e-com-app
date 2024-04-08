const jwt = require("jsonwebtoken");
const Usermodel = require("../model/usersSchema");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token)
      return res.status(401).json({
        status: "false",
        msg: "token not available",
      });

    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);

    if (jwtUser) {
      let user = await Usermodel.findById(jwtUser.id);
      req.user = user; //saving in req.body
      req.userId = user._id; //saving in req.body
    }
    next();
  } catch (error) {
    // console.log(error.message);
    res.json({ status: false, msg: "authenticaion failed" });
  }
};

const authorizedRole = (role) => {
  try {
    return (req, res, next) => {
      if (!role.includes(req.user.role)) {
        return res.status(403).json({ msg: "User is not allowed" });
      }
      next();
    };
  } catch (error) {
    console.error("Error in authorizedRole middleware:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { isAuthenticatedUser, authorizedRole };
