import axios from "axios";
import React, { useState } from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPass() {
  const validatePassword = Yup.object({
    newPassword: Yup.string()
      .min(7, "At least 7 characters")
      .max(20, "Password allowed only up to 20 characters")
      .required("New Password required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords didn't match")
      .required("Confirm Password required!"),
  });
  let initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const token = useParams();
  const navigate = useNavigate();

  const resetPw = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_HOST_URL}/user/reset`, {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        token: token.token,
      });
      setStatus(true);
      toast.success("Password Successfully Changed");
      let countdown = 10;
      const countdownInterval = setInterval(() => {
        setMessage(`Re-directing to login in ..${countdown}`);
        countdown--;
        if (countdown === 0) {
          clearInterval(countdownInterval);
          navigate("/login");
        }
      }, 1000);
    } catch (err) {
      toast.warn("Password-Reset Time Expired.");
      setStatus(false);
      setMessage(err.response.msg || "An error occurred");
      setTimeout(() => {
        setMessage("");
      }, 10000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-b from-blue-500 to-teal-500">
      <Formik
        initialValues={initialValues}
        validationSchema={validatePassword}
        onSubmit={(values) => {
          resetPw(values);
        }}
      >
        {() => (
          <Form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-center mb-4">
              Reset Password
            </h1>
            <Field
              className="w-full px-4 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none focus:border-teal-500"
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="enter New password"
            />
            <ErrorMessage
              name="newPassword"
              component="div"
              className="text-red-600 text-sm mb-4"
            />
            <Field
              className="w-full px-4 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none focus:border-teal-500"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="confirm New password"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-600 text-sm mb-4"
            />

            <p
              className={`text-center text-sm  mb-4" ${
                status === true ? "text-green-600" : "text-red-600"
              }`}
            >
              {status && <p className="font-bold">PASSWORD UPDATED</p>}
              {message}
            </p>
            <div>
              {status === false ? (
                <>
                  <Link
                    to="/forgot"
                    className="text-sm font-medium text-orange-600"
                  >
                    Generate New Token
                  </Link>
                </>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ResetPass;
