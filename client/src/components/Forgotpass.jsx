import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Forgotpass() {
  const { email } = useParams();
  const [edit, setEdit] = useState(email);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/user/forgotPass`,
        { email: edit }
      );
      if (response.data.status === true) {
        setMessage(response.data.detail);
        setEmailSent(true);
        toast.info("E-mail Sended : Check E-mail");
      } else {
        toast.error("Wrong-Email");
        setMessage(response.data.detail);
        setEmailSent(false);
      }
    } catch (error) {
      console.log("Error in sending data", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-500 to-blue-500">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full opacity-95">
        <h1 className="text-3xl font-bold mb-4 text-center">Forgot Password</h1>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your email to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 mb-4 text-gray-800 border rounded-lg focus:outline-none focus:border-teal-500 text-center"
          value={edit}
          onChange={(e) => setEdit(e.target.value)}
          // autoComplete="on"
          autoComplete={"on"}
        />
        <p
          className={`${
            emailSent ? "text-green-400" : "text-red-500"
          } text-sm mb-6 text-center`}
        >
          {message}
        </p>
        {emailSent && (
          <a
            className="text-orange-600 font-medium "
            href={process.env.REACT_APP_MAIL}
            target="_blank"
            rel="noreferrer"
          >
            Go to Mail
          </a>
        )}

        <button
          onClick={sendMail}
          className={`w-full mt-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || edit === ""}
          style={{ cursor: loading || edit === "" ? "not-allowed" : "pointer" }}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
}

export default Forgotpass;
