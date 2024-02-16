import axios from "axios";
import React, { useState } from "react";

import { useParams } from "react-router-dom";
function Forgotpass() {
  let { email } = useParams();
  let [edit, setEdit] = useState(email);
  let [message, setMessage] = useState("");
  let [emailSent, setEmailSent] = useState(false);
 

  // console.log(" emailSent", emailSent);
  const sendMail = async () => {
    await axios
      .post("/user/forgotPass", { email: edit })
      .then((response) => {
        if (response.data.status === true) {
          setMessage(response.data.detail);
          setEmailSent(true);
          console.log(" response", response.data.token);
        } else {
          // console.log(" noresponse", response.data.status);
          setMessage(response.data.detail);
          setEmailSent(false);
        }
      })
      .catch((err) => console.log("error in   sending data", err));
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
      </div>
    </>
  );
}

export default Forgotpass;
