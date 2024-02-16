const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");

const jwt = require("jsonwebtoken");
const sendEmail = require("../mail/Nodemailer");

route.post("/forgotPass", async (req, res) => {
  try {
    if (!req.body.email) res.send("email Required");
    else {
      let user = await Usermodel.findOne({ email: req.body.email });
      if (!user) {
        res.send({
          status: "Not Found",
          detail: "User with this email Not Found",
        });
      } else {
        let payload = {
          id: user._id,
          email: req.body.email,
        };

        const secret = process.env.JWT_SECRET;
        const token = await jwt.sign(payload, secret, {
          expiresIn: "1m",
        });

        const resetLink = `http://localhost:3000/reset/${token}`;
        const email = req.body.email;
        const subject = `Reset Password mail from e-com website.`;
        const htmlContent = `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>
          <br />
            Remember it validate only fo 1min. 
            Current time : ${Date()} `;
        sendEmail(email, subject, htmlContent)
          .then((mailResponse) => {
            if (mailResponse.success) {
              console.log("Email sent successfully");
            } else {
              console.log("Failed to send email");
            }
          })
          .catch((error) => console.log("Error sending email: ", error));

        res.send({
          status: true,
          detail:
            "Password reset link has been sent to your email. Check Email",
          user: user,
          token: token,
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
});
// Function to reset the password

module.exports = route;
