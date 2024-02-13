import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "FirstName name must be min 2 character.")
    .max(15, "First name must be between 3 - 15 character.")
    .required("First Name Required !"),
  lastName: Yup.string()
    .min(2, "LastName should be min 2 characters")
    .max(15, "LastName allowed only upto 15  characters")
    .required("Last Name Required !"),
  email: Yup.string().email().required("E-mail Required!"),
  password: Yup.string()
    .min(7, "at least min 7 characters")
    .max(20, " password allowed only upto 20 characters")
    .required("Password Required !"),
  phoneNumber: Yup.number()
    // .min(10, "Phone Number should be 10 characters")
    // .max(10, "Phone Number should be 10 characters")
    .required("Phone Number Required !"),
  checkbox: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
  //   date: Yup.date().default(() => new Date()),
});
export default validationSchema;
