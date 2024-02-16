const express = require("express");
const route = express.Router();
const Usermodel = require("../model/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../mail/Nodemailer");

route.post("/signup", async (req, res) => {
  try {
    if (!req.body.firstName) res.send("firstName Required");
    else if (!req.body.lastName) res.send("lastName Required");
    else if (!req.body.email) res.send("email Required");
    else if (!req.body.phoneNumber) res.send("phoneNumber Required");
    else if (!req.body.password) res.send("Password Required");
    else {
      let user = await Usermodel.findOne({ email: req.body.email });
      if (user) {
        res.send({
          status: false,
          detail: "Already a User with this email",
          user: user,
        });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.ROUND));
        const hash = await bcrypt.hash(req.body.password, salt);
        const secret = process.env.JWT_SECRET;

        const newUser = new Usermodel({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: hash,
        });

        newUser
          .save()
          .then((user) => {
            const payload = {
              id: user._id,
              firstName: req.body.firstName,
            };

            jwt.sign(payload, secret, { expiresIn: 783672 }, (err, token) => {
              res.send({
                status: true,
                detail: "User Saved",
                id: user._id,
                user: user,
                token: token,
              });
            });
          })
          .then(() => {
            const email = req.body.email;
            const subject = `Welcome ${newUser.firstName} to e-com website.`;
            const htmlContent = `<div>
            <h1>Hi Welcome to our Website</h1>
              <h1>${Date()}</h1>
            <p>this is system generated email please do not respond</p>
          </div>`;

            sendEmail(email, subject, htmlContent)
              .then((mailResponse) => {
                if (mailResponse.success) {
                  console.log("Email sent successfully");
                } else {
                  console.log("Failed to send email");
                }
              })
              .catch((error) => console.log("Error sending email: ", error));
          })
          .catch((err) => console.log(err, "problem in saving to database"));
      }
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = route;
