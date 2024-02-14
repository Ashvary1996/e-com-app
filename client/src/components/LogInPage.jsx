import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import logInValidation from "../validation/logInValidationSchema";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LogInPage() {
  const [detail, setDetail] = useState("");
  const [forgot, setForgot] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const submitForm = async (values) => {
    await axios
      .post(" /user/login", values)
      .then((response) => {
        if (response.data.status === true) {
          // console.log("Succefully Log IN : ", response.data.user);
          localStorage.setItem("jwt-token", response.data.token);
          // console.log("jwt token saved",token);
          navigate("/home");
        } else {
          setDetail(response.data.detail);
          setForgot(true);
          // console.log(response.data.detail);
        }
      })
      .catch((err) => console.log("error in   sending data", err));

    setTimeout(() => {
      setDetail("");
    }, 5000);
  };

  return (
    <div className="signUpFormDiv ">
      <Formik
        initialValues={initialValues}
        validationSchema={logInValidation}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
          //   resetForm({ values: "" });
        }}
      >
        {(values) => (
          <Form className="regForm ">
            <h1 className="text-2xl">Log In </h1>
            <div className="fieldDiv">
              <label htmlFor="email">E-mail </label>
              <Field id="email" name="email" type="email" placeholder="email" />
              <ErrorMessage name="email">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <div className="fieldDiv">
              <label htmlFor="password">Password </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
              <ErrorMessage name="password">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <p className="text-red-700 text-sm">{detail}</p>
            <p className="text-red-700 text-sm  hover:underline">
              {forgot == true ? (
                <Link to={`/forgot/${email.value}`}>
                  Forgot / Reset Password
                </Link>
              ) : null}
            </p>

            <div>
              <button
                className="bg-teal-600 text-white hover:bg-green-600  p-2 rounded mt-2"
                type="submit"
              >
                Log in{" "}
              </button>

              <i>
                <p className="inline-block text-white text-sm mt-1">
                  Dont have an account?{" "}
                </p>
                <Link
                  className="text-blue-500 ml-1 hover:underline hover:text-lg"
                  to="/signup"
                >
                  register here
                </Link>
              </i>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LogInPage;
