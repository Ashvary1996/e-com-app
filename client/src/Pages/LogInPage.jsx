import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import logInValidation from "../validation/logInValidationSchema";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logIn } from "../redux/userSlice";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function LogInPage() {
  const [detail, setDetail] = useState("");
  // const [forgot, setForgot] = useState(false);
  const signUpFormRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  // console.log("userId : ", userId);
  // console.log("token : ", tokenCookie);

  const initialValues = {
    email: "",
    password: "",
  };
  useEffect(() => {
    if (window.innerWidth < 768 && signUpFormRef.current) {
      signUpFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={signUpFormRef}
      className="signUpFormDiv p-4 sm:p-10 bg-gradient-to-r from-orange-200 to-orange-400 min-h-screen"
    >
      <ToastContainer closeOnClick id="myContainer" />
      <Formik
        initialValues={initialValues}
        validationSchema={logInValidation}
        onSubmit={(values, { resetForm }) => {
          dispatch(logIn(values, navigate, setDetail, toast));
        }}
      >
        {(formikProps) => {
          const { values } = formikProps;

          return (
            <Form className="loginForm w-full max-w-md sm:max-w-lg m-auto p-6 sm:p-10 bg-white rounded-lg shadow-lg">
              <h1 className="heading text-xl sm:text-2xl font-semibold text-center mb-4">
                Log In
              </h1>

              <div className="fieldDiv mb-4 w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  E-mail
                </label>
                <div className="flex items-center border bg-white border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user1234@gmail.com"
                    className="flex-grow px-3 py-2 outline-none"
                  />
                </div>
                <ErrorMessage name="email">
                  {(emsg) => (
                    <div className="error text-red-500 text-xs mt-1">
                      {emsg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="fieldDiv mb-4 w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <div className="flex items-center border bg-white border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                  <Field
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="user1234"
                    className="flex-grow px-3 py-2 outline-none"
                  />
                  <button
                    id="togglePassword"
                    type="button"
                    className="px-3 py-2 bg-white outline-none border-none"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <ViewIcon color="black" />
                    ) : (
                      <ViewOffIcon color="black" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="password">
                  {(emsg) => (
                    <div className="error text-red-500 text-xs mt-1">
                      {emsg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <p className="text-red-500 text-sm mt-1">{detail}</p>

              <p className="text-orange-500 text-sm mt-2 text-center">
                <Link
                  to={`/forgot/${values.email}`}
                  className="hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>

              <div className="text-center mt-4">
                <button
                  className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded w-full sm:w-1/2 font-semibold"
                  type="submit"
                >
                  Log In
                </button>
              </div>

              <div className="mt-6 flex justify-center text-sm">
                <p className="text-gray-600">Don't have an account?</p>
                <Link
                  to="/signup"
                  className="text-orange-500 hover:underline ml-2"
                >
                  Register here
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default LogInPage;
