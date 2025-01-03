import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "! First name must be at least 2 characters long.")
    .max(15, "! First name must be no more than 15 characters long.")
    .required("! First name is required."),
  lastName: Yup.string()
    .min(2, "! Last name must be at least 2 characters long.")
    .max(15, "! Last name must be no more than 15 characters long.")
    .required("! Last name is required."),
  email: Yup.string()
    .email("! Please enter a valid email address.")
    .required("! Email is required."),
  password: Yup.string()
    .min(7, "! Password must be at least 7 characters long.")
    .max(20, "! Password must be no more than 20 characters long.")
    .required("! Password is required."),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "! Phone number must be exactly 10 digits.")
    .required("! Phone number is required."),
  checkbox: Yup.boolean().oneOf(
    [true],
    "! You must accept the terms and conditions."
  ),
});

export default validationSchema;
