const Usermodel = require("../model/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/Nodemailer");
const { sendToken } = require("../utils/jwtToken");

const signUpFn = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName) return res.send("firstName Required");
    else if (!lastName) return res.send("lastName Required");
    else if (!email) return res.send("email Required");
    else if (!phoneNumber) return res.send("phoneNumber Required");
    else if (!password) return res.send("Password Required");

    let existingUser = await Usermodel.findOne({ email: email });
    if (existingUser) {
      return res.send({
        status: false,
        detail: "Already a User with this email",
        user: existingUser,
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.ROUND));
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = new Usermodel({
      firstName,
      lastName,
      password: hash,
      email: email,
      phoneNumber,
      avatar: {
        public_id: "demoID",
        url: "demoUrl",
      },
    });

    await user.save();
    /////////////////
    // res.cookie("signupTestCooki", "dummy data");
    sendToken(user, res, "User Saved");
    const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() + 5);  // Convert to India Standard Time (UTC +5:30)
    // currentDate.setMinutes(currentDate.getMinutes() + 30);
    // const indiaTime = currentDate.toString();
    const indiaTime = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const subject = `Welcome ${user.firstName} to e-com website.`;
    const htmlContent = `<div>
        <h1>Hi Welcome to our Website</h1>
        <h1>${indiaTime()}</h1>
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
  } catch (error) {
    res.json({ detail: "Internal Server Error", error: error.message });
  }
};

const logInFn = async (req, res) => {
  try {
    if (!req.body.email) return res.send("Email Required");
    else if (!req.body.password) return res.send("Password Required");

    const user = await Usermodel.findOne({ email: req.body.email })
      .select("+password") // .select will select the  {select: false,} from schema
      .lean(); // .lean will return plain js Obj
    if (!user) {
      return res.json({
        status: "Not Found",
        detail: "User with this email not found",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      delete user.password; // this will not return password in response
      sendToken(user, res, "Log In Success");
    } else {
      return res.json({
        success: false,
        detail: "Logged In Failed / Wrong Password",
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.json({ message: "Internal Server Error", error: error.message });
  }
};

const logOutFn = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({
    success: true,
    msg: "Logged Out Successfully",
  });
};
// /////////////////////////////////

const getallUsers = async (req, res) => {
  try {
    const user = await Usermodel.find({});

    return res.json({
      status: true,
      total_users: user.length,
      listofUser: user.map((elem, i) => {
        return {
          no: i + 1,
          id: elem._id,
          firstName: elem.firstName,
          email: elem.email,
          role: elem.role,
        };
      }),
      inMoreDetail: user,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.json({ message: "Internal Server Error", error: error.message });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { findUserId, updateRole } = req.body;
    const user = await Usermodel.findByIdAndUpdate(
      findUserId,
      { role: updateRole },
      { new: true }
    );

    return res.json({
      status: true,
      User_Details: user,
    });
  } catch (error) {
    console.error("Error in fetching Details:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// /////////////////////////////////
const forgotPassFn = async (req, res) => {
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

        // const resetLink = `http://localhost:3000/reset/${token}`;
        const resetLink = `${process.env.CORS_ORIGIN}/reset/${token}`;
        // const resetLink = `${req.protocol}://${req.get("host")}/reset/${token}`;
        // const currentDate = new Date().toString();

        const currentDate = new Date(); 
        // currentDate.setHours(currentDate.getHours() + 5);  // Convert to India Standard Time (UTC +5:30)
        // currentDate.setMinutes(currentDate.getMinutes() + 30);
        // const indiaTime = currentDate.toString();
        const indiaTime = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

        const email = req.body.email;
        const subject = `Reset Your Password - Action Required`;
        // const htmlContent = `
        // <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        //   <p>Click the link below to reset your password. Please note that the link is valid for only 5 minutes.</p>
        //   <p><a href="${resetLink}" style="color: #0652DD; text-decoration: none;">Reset your password</a></p>
        //   <p><strong>Current time:</strong> ${currentDate}</p>
        //   <p>If you did not request a password reset, please ignore this email or contact support if you believe this is an error.</p>
        // </div>
        // `;
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
          <h2 style="color: #0652DD; margin-bottom: 16px;">Password Reset Request</h2>
          <p>We received a request to reset your password. You can reset your password by clicking the button below. Please note that this link will expire in <strong>5 minutes</strong>.</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #0652DD; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email. If you believe this was done in error, please contact our support team immediately.</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 14px; color: #666;">
            <strong>Current Time:</strong> ${indiaTime}<br>
            If you encounter any issues, contact our support team at <a href="mailto:legion.ugc.lt@gmail.com" style="color: #0652DD;">legion.ugc.lt@gmail.com</a>.
          </p>
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
          token: token,
        });
      }
    }
  } catch (error) {
    res.json({ message: "Internal Server Error", error: error.message });
  }
};

const resetPassFn = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  try {
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usermodel.findById(jwtUser.id);

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ status: false, msg: "Passwords do not match" });
    }
    if (!newPassword || newPassword.length < 7) {
      return res.status(400).json({
        status: false,
        msg: "Password must be at least 7 characters long",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(Number(process.env.ROUND));
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    // await user.save();
    await user.save({ validateBeforeSave: false });

    // const currentDate = new Date().toString();
    const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() + 5);  // Convert to India Standard Time (UTC +5:30)
    // currentDate.setMinutes(currentDate.getMinutes() + 30);
    // const indiaTime = currentDate.toString();
    const indiaTime = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const email = user.email;
    const subject = "Your Password Has Been Successfully Reset";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
      <h2 style="color: #0652DD; margin-bottom: 16px;">Password Reset Successfully</h2>
      <p>Your password has been successfully reset on <strong>${indiaTime}</strong>. If you did not initiate this change, we recommend that you secure your account immediately.</p>
      
      <p>If this was you, no further action is needed. You can now <a href="${process.env.CORS_ORIGIN}/login/" style="color: #0652DD;">log in to your account</a> using your new password.</p>
    
      <p>If you didn't request this reset, please <strong>change your password</strong> and contact our support team right away to ensure your account’s safety.</p>
    
      <p>If you need any assistance, please do not hesitate to reach out to our support team at <a href="mailto:legion.ugc.lt@gmail.com" style="color: #0652DD;">legion.ugc.lt@gmail.com</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
      
      <p style="font-size: 14px; color: #666;">
        Thank you for ensuring the security of your account! <br>
        If you continue to experience issues, please contact us immediately.
      </p>
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
      .catch((err) => console.log("Error sending email: ", err));

    res.status(200).send("Password has been updated.");
  } catch (error) {
    res
      .status(500)
      // .send("Internal Error: Invalid or expired token. Generate New One.");
      .json({
        msg: "Internal Error: Invalid or expired token. Generate New One.",
        error: error,
      });
  }
};

const updatePassFn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ msg: "user need to logged IN " });

    const { oldPassword, newPassword, confirmPassword } = req.body;

    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usermodel.findById(jwtUser.id)
      .select("+password")
      .lean();

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, msg: "Old Password entered wrong" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ status: false, msg: "Passwords do not match" });
    }

    if (!newPassword || newPassword.length < 7) {
      return res.status(400).json({
        status: false,
        msg: "Password must be at least 7 characters long",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.ROUND));
    const hash = await bcrypt.hash(newPassword, salt);

    await Usermodel.findByIdAndUpdate(user._id, { password: hash });

    // const currentDate = new Date().toISOString();
    const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() + 5);  // Convert to India Standard Time (UTC +5:30)
    // currentDate.setMinutes(currentDate.getMinutes() + 30);
    // const indiaTime = currentDate.toString();
    const indiaTime = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    
    const email = user.email;
    const subject = "Your Password Has Been Successfully Updated";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
      <h2 style="color: #0652DD; margin-bottom: 16px;">Password Update Successfully</h2>
      <p>Your password has been successfully updated on <strong>${indiaTime}</strong>. If you did not initiate this change, we highly recommend that you secure your account immediately by updating your password and contacting support.</p>
      
      <p>If this was you, no further action is needed. You can now <a href="${
        req.protocol
      }://${req.get(
      "host"
    )}/home/" style="color: #0652DD;">log in to your account</a> using your new password.</p>
    
      <p>If you did not request this update or if you have any concerns, please <strong>change your password</strong> immediately and contact our support team to ensure your account’s security.</p>
    
      <p>If you need assistance or have any questions, feel free to reach out to us at <a href="mailto:legion.ugc.lt@gmail.com" style="color: #0652DD;">legion.ugc.lt@gmail.com</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
      
      <p style="font-size: 14px; color: #666;">
        Thank you for ensuring the security of your account! <br>
        If you continue to experience any issues, please contact us immediately.
      </p>
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
      .catch((err) => console.log("Error sending email: ", err));

    sendToken(user, res, "Password has been updated");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Internal Server Error");
  }
};
// /////////////////////////////////
const updateProfile = async (req, res) => {
  try {
    const updateUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    };
    const userID = req.user._id;
    if (!userID) {
      return res.status(400).json({ error: "User ID not provided" });
    }
    const user = await Usermodel.findByIdAndUpdate(userID, updateUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    sendToken(user, res, "User updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);

    res
      .status(500)
      .json({ error: "Failed to update user profile", message: error.message });
  }
};
const updateProfileByAdmin = async (req, res) => {
  try {
    const userID = req.body.userID;
    const updateUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    };
    if (!userID) {
      return res.status(400).json({ error: "User ID not provided by Admin" });
    }
    const user = await Usermodel.findByIdAndUpdate(userID, updateUserData, {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    });

    // sendToken(user, res, "User updated successfully");

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating user profile:", error);

    res
      .status(500)
      .json({ error: "Failed to update user profile", message: error.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User with id ${userId} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errMsg: error.message,
    });
  }
};

module.exports = {
  signUpFn,
  logInFn,
  getallUsers,
  forgotPassFn,
  resetPassFn,
  logOutFn,
  updatePassFn,
  updateProfile,
  updateProfileByAdmin,
  updateUserRole,
  deleteUser,
};
