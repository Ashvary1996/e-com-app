const Usermodel = require("../model/usersSchema");
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../mail/Nodemailer");
route.post("/reset", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const jwtuser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usermodel.findById(jwtuser.id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(Number(process.env.ROUND));
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    let email = user.email;
    let subject = "Password reset successfully";
    let htmlContent = `<h1>Hi you have successfully reset your password</h1>
    <p>if this not done by you then please change the password asap.</p>
    <p>plese visit website to change it. </p> ;`;

    sendEmail(email, subject, htmlContent)
      .then((mailResponse) => {
        if (mailResponse.success) {
          console.log("Email sent successfully");
        } else {
          console.log("Failed to send email");
        }
      })
      .catch((err) => console.log("Error sending email: ", err));

    res.send("Password has been updated.");
  } catch (error) {
    res.status(500).send("Invalid or expired token.");
  }
});

module.exports = route;
