import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email().required("E-mail Required !"),
  password: Yup.string()
    // .min(7, "at least min 7 characters")
    // .max(20, " password allowed only upto 20 characters")
    .required("Password Required !"),
});
export default validationSchema;
 