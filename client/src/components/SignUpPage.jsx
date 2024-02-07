import React from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";

function SignUpPage() {
  let initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    varifyPassword: "",
    phoneNumber: "",
    checkbox: false,
  };
  let submitForm = (values) => {
    console.log("values", values);
  };
  return (
    <>
      <h1>Sign-Up Form</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
          //   resetForm({ values: "" });
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor="firstName">First Name : </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                placeholder="firstName"
              />

              <label htmlFor="lastName">Last Name : </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                placeholder="lastName"
              />
            </div>
            <div>
              <label htmlFor="email">E-mail : </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="email address"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number : </label>
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="mobile Number"
                maxLength="10"
              />
            </div>
            <div>
              <label htmlFor="password">Password : </label>
              <Field
                id="password"
                name="password"
                type="text"
                placeholder="password"
                maxLength="15"
              />
            </div>

            <label>
              <Field type="checkbox" name="checkbox" value={values.toggle} />I
              agree to share my details will be used by this website.
            </label>
            <div>
              <button type="submit">Sign-Up </button>
              <p>
                Already a user? go to <a href="">Log-In</a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default SignUpPage;
