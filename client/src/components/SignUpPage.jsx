import React from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import validationSchema from "../validation/validationSchema";

function SignUpPage() {
  let initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    checkbox: false,
  };

  let submitForm = (values) => {
    console.log("values", values);
  };
  return (
    <div className="bg-slate-400 bg-contain  ">
      <h1 className="h-10 font-bold text-xl ">Sign-Up Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
          //   resetForm({ values: "" });
        }}
      >
        {({ values }) => (
          <Form className="regForm flex-col">
            <div className="fieldDiv">
              <label htmlFor="firstName">First Name : </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                placeholder="firstName"
              />{" "}
              <ErrorMessage name="firstName">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
              <label htmlFor="lastName">Last Name : </label>
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
            <div className="">
              <div className="fieldDiv">
                <label htmlFor="email">E-mail : </label>
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
                <label htmlFor="phoneNumber">Phone Number : </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder="mobile Number"
                  maxLength="10"
                />{" "}
                <ErrorMessage name="phoneNumber">
                  {(emsg) => <div className="error ">{emsg}</div>}
                </ErrorMessage>
              </div>
              <div className="fieldDiv">
                <label htmlFor="password">Password : </label>
                <Field
                  id="password"
                  name="password"
                  type="text"
                  placeholder="password"
                  maxLength="15"
                />
                <ErrorMessage name="password">
                  {(emsg) => <div className="error ">{emsg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="fieldDiv">
              <label className="checkbox label" htmlFor="checkbox">
                <Field
                  name="checkbox"
                  type="checkbox"
                  className="checkbox"
                  value={values.toggle}
                />
                I agree to share my details will be used by this website.
              </label>

              <ErrorMessage name="checkbox">
                {(emsg) => <div className="error ">{emsg}</div>}
              </ErrorMessage>
            </div>
            <div>
              <button type="submit">Sign-Up </button>
              <p>
                Already a user? go to <a href="">Log-In</a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpPage;
