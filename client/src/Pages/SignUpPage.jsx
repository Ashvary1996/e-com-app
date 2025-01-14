import React, { useEffect, useRef, useState } from "react";
import { Form, Field, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import signUpValidation from "../validation/signUpValidationSchema";
import logo from "../items/logo.png";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signUp } from "../redux/userSlice";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function SignUpPage() {
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const signUpFormRef = useRef(null);
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    checkbox: false,
  };

  useEffect(() => {
    if (window.innerWidth < 768 && signUpFormRef.current) {
      signUpFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="mainSignUpDiv flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-orange-200 to-white">
      <div className="welcomeDiv w-full lg:w-2/3 lg:mr-2    p-5 lg:p-10 bg-white shadow-lg rounded-lg m-auto">
        <h1 className="text-2xl font-bold mb-4 text-center lg:text-left break-words">
          Welcome to Your Next Shopping Adventure!
        </h1>
        <img className="mx-auto my-4 w-32 h-32" src={logo} alt="Logo" />
        <div className="text-sm text-gray-600 italic mb-4 text-center lg:text-left">
          Get ready to embark on an exhilarating shopping journey like no other!
          <p className="inline-block text-red-700">Legion e-Com</p> isn't just
          an e-commerce platform; it's your first-class ticket to an endless
          array of exclusive products, jaw-dropping deals, and personalized
          shopping experiences that cater to your unique style and preferences.
        </div>
        <div className="text-sm text-gray-600 italic text-center lg:text-left">
          <p className="inline-block underline">Sign up today</p> and transform
          your shopping routine into an exciting adventure!
        </div>
      </div>
      <ToastContainer closeOnClick id="myContainer" />
      <div
        ref={signUpFormRef}
        className="signUpFormDiv w-full lg:w-2/3  flex justify-center items-center p-1 "
      >
        <Formik
          initialValues={initialValues}
          validationSchema={signUpValidation}
          onSubmit={(values, { resetForm }) => {
            const userData = {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              phoneNumber: values.phoneNumber,
            };
            // const rD =
             dispatch(signUp(userData, setDetail, toast, navigate));
            // console.log(rD);
            
          }}
        >
          {({ values }) => (
            <Form className="fform w-full  max-w-xl  p-2 shadow-lg rounded-lg">
              <h1 className="text-xl font-extrabold mb-6 text-center  lg:text-center  text-white ">
                Create A New Account
              </h1>
              <div className="mb-2">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-semibold"
                >
                  First Name
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2  rounded font-semibold outline-none focus-within:ring-1 focus-within:ring-orange-500  "
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-semibold"
                >
                  Last Name
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 outline-none focus-within:ring-1 focus-within:ring-orange-500 rounded font-semibold"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold"
                >
                  E-mail
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 outline-none focus-within:ring-1 focus-within:ring-orange-500 rounded font-semibold"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 font-semibold"
                >
                  Phone Number
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder="Mobile Number"
                  maxLength="10"
                  className="w-full px-3 py-2 outline-none focus-within:ring-1 focus-within:ring-orange-500 rounded font-semibold"
                  onInput={(e) => {
                    // Restrict non-numeric input
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2 ">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold"
                >
                  Password
                </label>
                <div className="flex pDIv  rounded-md focus-within:ring-1 focus-within:ring-orange-500">
                  <Field
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Password"
                    // maxLength="20"
                    className="px-3 py-2 border-none  rounded-l-md w-[90%] font-semibold focus:outline-none "
                  />

                  <button
                    id="togglePassword"
                    type="button"
                    className="text-white rounded-r-sm p-2 w-[10%] relative bg-white focus:outline-none  "
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <ViewIcon color="black" />
                    ) : (
                      <ViewOffIcon color="black" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2 ">
                <label htmlFor="checkbox" className="label flex ">
                  <Field
                    type="checkbox"
                    name="checkbox"
                    id="checkbox"
                    className=" ml-5 mr-10 w-4 justify-start hover:cursor-pointer "
                  />
                  <span
                    className="text-white justify-center font-semibold"
                    htmlFor="checkbox"
                  >
                    I agree to share my details.
                  </span>
                </label>
                <div className="flex items-center"></div>
                <ErrorMessage
                  name="checkbox"
                  component="div"
                  className="text-red-500 text-sm mt-1 font-bold"
                />
              </div>
              <div className="mb-2">
                <p className="text-red-700 text-sm">{detail}</p>
              </div>
              <button
                className="w-32 bg-orange-500  hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign-Up
              </button>
              <div className="mt-4 flex justify-between items-center text-sm">
                <p className="text-gray-300">Already a user?</p>
                <Link to="/login" className="text-amber-500 hover:underline">
                  Log-In
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUpPage;
