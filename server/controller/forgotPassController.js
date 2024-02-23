const Usermodel = require("../model/usersSchema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/Nodemailer");
const bcrypt = require("bcrypt");

exports.forgotPassFn = async (req, res) => {
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
};

exports.resetPassFn = async (req, res) => {
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
};
 