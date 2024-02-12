import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import logInValidation from "../validation/logInValidationSchema";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LogInPage() {
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const submitForm = async (values) => {
    await axios
      .post("http://localhost:5000/user/login", values)
      .then((response) => {
        if (response.data.status === true) {
          console.log("Succefully Log IN : ", response.data.user);
          navigate("/home");
        } else {
          setDetail(response.data.detail);
          console.log(response.data.detail);
        }
      })
      .catch((err) => console.log("error in   sending data", err));
  };

  return (
    <div>
      <h1>Log In </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={logInValidation}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
          //   resetForm({ values: "" });
        }}
      >
        {() => (
          <Form className="border border-red-700 p-10 ">
            <div>
              <label htmlFor="email">E-mail : </label>
              <Field id="email" name="email" type="email" placeholder="email" />
              <ErrorMessage name="email">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <div>
              <label htmlFor="password">Password : </label>
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
            <div>
              <button className="bg-gray-600 p-2 rounded mt-2" type="submit">
                Log in{" "}
              </button>
              <p className="text-sm">
                Dont have an account?{" "}
                <Link to="/signup" className="text-blue-400 italic">
                  Sign Up now
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LogInPage;
