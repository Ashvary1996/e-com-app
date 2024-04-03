import React, { useEffect, useRef, useState } from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import signUpValidation from "../validation/signUpValidationSchema";
import axios from "axios";
import logo from "../items/logo.png";
import { toast } from "react-toastify";

function SignUpPage() {
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const signUpFormRef = useRef(null);
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
          // resetForm({ values: "" });
          toast.success("Sign Up Successfully");
          navigate("/login");
        } else {
          setDetail(response.data.detail);
          console.log(response.data.detail);
        }
      })
      .catch((err) => console.log("error in saving/sending data", err));
  };
  useEffect(() => {
    if (window.innerWidth < 768 && signUpFormRef.current) {
      signUpFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <div className="mainSignUpDiv flex flex-wrap min-h-screen bg-gradient-to-r from-teal-300 to-blue-500">
      <div className="welcomeDiv w-full lg:w-1/3 p-5 lg:p-10 bg-white shadow-lg rounded-lg m-auto">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Your Next Shopping Adventure!
        </h1>
        <img className="mx-auto my-4" src={logo} alt="Logo" />
        <p className="text-sm text-gray-600 italic mb-4">
          Get ready to embark on an exhilarating shopping journey like no other!
          <p className="inline-block text-red-700">Legion e-Com</p> isn't just
          an e-commerce platform; it's your first-class ticket to an endless
          array of exclusive products, jaw-dropping deals, and personalized
          shopping experiences that cater to your unique style and preferences.
        </p>
        <p className="text-sm text-gray-600 italic">
          <p className="inline-block underline"> Sign up today</p> and transform
          your shopping routine into an exciting adventure!
        </p>
      </div>
      <div
        ref={signUpFormRef}
        className="signUpFormDiv w-full lg:w-2/3 flex justify-center items-center p-5"
      >
        <Formik
          className="w-full max-w-xl"
          initialValues={initialValues}
          validationSchema={signUpValidation}
          onSubmit={(values, { resetForm }) => {
            submitForm(values, resetForm);
          }}
        >
          {({ values }) => (
            <Form className="regForm w-[100%]  bg-white p-8 shadow-lg rounded-lgw-full max-w-lg  rounded-lg">
              <h1 className="heading  text-xl font-semibold mb-6">
                Create A new account
              </h1>
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
              <div className="mt-4">
                <p className="text-red-700 text-sm">{detail}</p>
              </div>
              <div>
                <button
                  className="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign-Up
                </button>
                <br />

                <div className="mt-4 flex justify-between items-center text-sm overflow-hidden lg:overflow-visible">
                  <p className="text-gray-300 ">Already a user?</p>
                  <Link
                    to="/login"
                    className="text-amber-500 hover:underline transform hover:scale-150 transition-transform duration-200 mr-10 p-1"
                  >
                    Log-In
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUpPage;
