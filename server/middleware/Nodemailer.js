const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, response: info.response };
  } catch (error) {
    console.log("Error in sendEmail: " + error);
    return { success: false, error: error };
  }
};

module.exports = sendEmail;
