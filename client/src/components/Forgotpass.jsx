import axios from "axios";
import React, { useState } from "react";

import { useParams } from "react-router-dom";
function Forgotpass() {
  let { email } = useParams();
  let [edit, setEdit] = useState(email);
  let [message, setMessage] = useState("");
  let [emailSent, setEmailSent] = useState(false);
  let [verify, setVerify] = useState(true);

  // console.log(" emailSent", emailSent);
  const sendMail = async () => {
    await axios
      .post("/user/forgotPass", { email: edit })
      .then((response) => {
        if (response.data.status === true) {
          setMessage("Email Sent Successfully");
          setEmailSent(true);
          // console.log(" response", response.data.status);
        } else {
          // console.log(" noresponse", response.data.status);
          setMessage(response.data.detail);
          setEmailSent(false);
        }
      })
      .catch((err) => console.log("error in   sending data", err));
  };
  const resetPw = () => {
    if (verify) {
    } else {
      console.log("wrong otp");
    }
  };
  return (
    <>
      <div className="border-2 border-red-600  m-auto mt-10 w-[50%]">
        <h1>Forgot password </h1>
        <p>Please enter your email to reset password</p>
        <input
          type="email"
          placeholder="email address"
          className=" text-center p-2 text-lg inline border w-[80%]"
          value={edit}
          onChange={(e) => setEdit(e.target.value)}
        />

        <br />
        <p
          className={`${
            emailSent === true ? "text-teal-500 " : "text-red-500 "
          }`}
        >
          {message}
        </p>
        <br />
        <button onClick={sendMail} className="w-[20%] p-2 mt-3 ">
          send email
        </button>

        <div>
          {emailSent === !true ? (
            ""
          ) : (
            <div>
              <p>
                check email and enter 4 digit otp to verify and proceed to reset
                password
              </p>
              <div>
                <input type="number" className="border-2 w-10" />
                <input type="number" className="border-2 w-10" />
                <input type="number" className="border-2 w-10" />
                <input type="number" className="border-2 w-10" />
              </div>
              <div>
                <button onClick={resetPw} className="w-30 p-2 text-sm">
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {verify ? (
        <div className="border-2 border-red-900 p-2 mt-20 w-[50%] m-auto">
          <input
            className="border-w border-red-900"
            type="password"
            placeholder="new password"
          />
          <button>Update Password</button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Forgotpass;
