import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import logInValidation from "../validation/logInValidationSchema";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken, setUserID } from "../config/authTokenUser";

function LogInPage() {
  const [detail, setDetail] = useState("");
  const [forgot, setForgot] = useState(false);
  const signUpFormRef = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };
  useEffect(() => {
    if (window.innerWidth < 768 && signUpFormRef.current) {
      signUpFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const submitForm = async (values) => {
    await axios
      .post("/user/login", values)
      .then((response) => {
        if (response.data.status === true) {
          setToken(response.data.token);
          setUserID(response.data.user._id);
          navigate("/home");
        } else {
          setDetail(response.data.detail);
          setForgot(true);
        }
      })
      .catch((err) => console.log("error in sending data", err));

    setTimeout(() => {
      setDetail("");
    }, 5000);
  };

  return (
    <div ref={signUpFormRef} className="signUpFormDiv p-10">
      <Formik
        initialValues={initialValues}
        validationSchema={logInValidation}
        onSubmit={(values, { resetForm }) => {
          submitForm(values);
          //   resetForm({ values: "" })
        }}
      >
        {(formikProps) => {
          const { values } = formikProps;
          // console.log(values);

          return (
            <Form className="loginForm p-10 w-[60%] m-auto">
              <h1 className="heading text-2xl">Log In </h1>
              <div className="fieldDiv">
                <label htmlFor="email">E-mail </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                />
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

              <p className="text-red-700 text-sm  hover:underline mt-1">
                {forgot === true ? (
                  <Link to={`/forgot/${values.email}`}>
                    Forgot / Reset Password
                  </Link>
                ) : null}
              </p>

              <div className="">
                <button
                  className="bg-teal-600 text-white hover:bg-green-600  p-1 rounded mt-2 w-[35%] text-xxl font-semibold"
                  type="submit"
                >
                  Log-In
                </button>
                <br />

                <div className=" mt-3 flex justify-center  text-sm overflow-hidden lg:overflow-visible">
                  <p className="inline-block text-white text-sm mt-1 mr-1.5">
                    Don't have an account? 
                  </p>
                  <Link
                    to="/signup"
                    className="text-amber-500 hover:underline transform hover:scale-125 transition-transform duration-100 p-1 ease-in-out  "
                  >
                    Register here
                  </Link>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default LogInPage;
