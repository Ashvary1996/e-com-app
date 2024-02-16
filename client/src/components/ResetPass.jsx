import axios from "axios";
import React, { useState } from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";

function ResetPass() {
  const validatePassword = Yup.object({
    password: Yup.string()
      .min(7, "at least min 7 characters")
      .max(20, " password allowed only upto 20 characters")
      .required("Password Required !"),
  });
  let initialValues = {
    password: "",
  };

  const [message, setMessage] = useState("");
  const token = useParams();
  const navigate = useNavigate();

  const resetPw = async (values) => {
    await axios
      .post(`/user/reset `, {
        newPassword: values.password,
        token: token.token,
      })
      .then((response) => {
        // console.log(response.data);
        setMessage(response.data + " Redirecting to login");
        setTimeout(() => {
          navigate("/login");
        }, 3333);
      })
      .catch((err) => {
        setMessage(err.response.data);
        console.log("error in sending data", err);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validatePassword}
      onSubmit={(values) => {
        resetPw(values);
      }}
    >
      {() => (
        <Form className="border-2 border-red-900 p-2 mt-20 w-[50%] m-auto">
          <h1>Reset Password</h1>

          <Field
            className="border-w border-red-900"
            type="text"
            id="password"
            name="password"
            placeholder="new password"
          />
          <ErrorMessage name="password">
            {(emsg) => <div className="error text-red-600 ">{emsg}</div>}
          </ErrorMessage>
          <h1>{message}</h1>
          <button className="bg-slate-600" type="submit">
            Update Password
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ResetPass;
