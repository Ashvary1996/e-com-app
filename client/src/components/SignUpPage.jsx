import React, { useState } from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import signUpValidation from "../validation/signUpValidationSchema";
import axios from "axios";

function SignUpPage() {
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  let initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    checkbox: false,
  };

  let submitForm = async (values, resetForm) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
    };

    await axios
      .post("/user/signup", data)
      .then((response) => {
        if (response.data.status === true) {
          setDetail("");
          console.log("Succefully Registerd : ", response.data.user);
          resetForm({ values: "" });
          navigate("/login");
        } else {
          setDetail(response.data.detail);
          console.log(response.data.detail);
        }
      })
      .catch((err) => console.log("error in saving/sending data", err));
  };
  return (
    <div className="signUpFormDiv ">
      <Formik
        initialValues={initialValues}
        validationSchema={signUpValidation}
        onSubmit={(values, { resetForm }) => {
          submitForm(values, resetForm);
        }}
      >
        {({ values }) => (
          <Form className="regForm ">
            <h1 className="heading">Create A new account</h1>
            <div className="fieldDiv">
              <label htmlFor="firstName">First Name </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                placeholder="firstName"
                autoFocus
              />{" "}
              <ErrorMessage name="firstName">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
              <label htmlFor="lastName">Last Name </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                placeholder="lastName"
              />
              <ErrorMessage name="lastName">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>

            <div className="fieldDiv">
              <label htmlFor="email">E-mail </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="email address"
              />{" "}
              <ErrorMessage name="email">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <div className="fieldDiv">
              <label htmlFor="phoneNumber">Phone Number </label>
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="Number"
                placeholder="mobile Number"
                maxLength="10"
              />
              <ErrorMessage name="phoneNumber">
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
                maxLength="15"
              />
              <ErrorMessage name="password">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>

            <div className="fieldDiv">
              <label className="checkbox label " htmlFor="checkbox">
                <Field
                  name="checkbox"
                  type="checkbox"
                  className="checkbox mr-2    "
                  value={values.toggle}
                />
                I agree to share my details.
              </label>

              <ErrorMessage name="checkbox">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <div>
              <p className="text-red-700 text-sm">{detail}</p>
            </div>
            <div>
              <button
                className="bg-teal-400 p-2 rounded-lg font-semibold text-xl w-[90%] hover:bg-amber-600"
                type="submit"
              >
                Sign-Up
              </button>
              <br />
              <i>
                <p className="inline-block text-white text-sm mt-1">
                  Already a user? go to
                </p>
                <Link
                  className="text-blue-600 ml-1 hover:underline hover:text-lg"
                  to="/login"
                >
                  Log-In
                </Link>
              </i>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpPage;
