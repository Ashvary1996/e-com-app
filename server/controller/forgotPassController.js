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
          expiresIn: "5m",
        });

        const resetLink = `http://localhost:3000/reset/${token}`;
        const currentDate = new Date().toISOString();

        const email = req.body.email;
        const subject = `Action Required: Reset Your Password.`;
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Click the link below to reset your password. Please note that the link is valid for only 5 minutes.</p>
          <p><a href="${resetLink}" style="color: #0652DD; text-decoration: none;">Reset your password</a></p>
          <p><strong>Current time:</strong> ${currentDate}</p>
          <p>If you did not request a password reset, please ignore this email or contact support if you believe this is an error.</p>
        </div>
        `;
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

    const currentDate = new Date().toISOString();
    let email = user.email;
    let subject = "Password reset successfully";
    let htmlContent = `
    <h1>Password Reset Successfully</h1>
    <h4> On : ${currentDate}</h3>
    <p>You have successfully reset your password. If you did not initiate this change, please secure your account immediately.</p>
    <p>Visit <a href="http://localhost:3000/home/" target="_blank">our website</a> to log in or change your password again if necessary.</p>
    <p>If you encounter any issues or did not request a password reset, please contact our support team immediately at <a href="mailto:legion.ugc.lt@gmail.com">legion.ugc.lt@gmail.com</a>.</p>
    <p>Thank you for ensuring the security of your account!</p>
    `;

    sendEmail(email, subject, htmlContent)
      .then((mailResponse) => {
        if (mailResponse.success) {
          console.log("Email sent successfully");
        } else {
          console.log("Failed to send email");
        }
      })
      .catch((err) => console.log("Error sending email: ", err));

    res.status(200).send("Password has been updated.");
  } catch (error) {
    res.status(500).send("Invalid or expired token. Generate New One.");
  }
};
