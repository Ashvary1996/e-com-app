import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import Cookies from "js-cookie";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    userName: "",
    // token: Cookies.get("ecom_token_Byash"),
    token: "",
    detail: "",
  },
  reducers: {
    setDetail: (state, action) => {
      state.detail = action.payload;
    },
    setUserID: (state, action) => {
      state.userId = action.payload;
    },
    setCokies: (state, action) => {
      state.token = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

// Defineing the signUp action creator
export const signUp =
  (userData, setDetail, toast, navigate) => async (dispatch) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:5000/user/signup",
        userData
      );
      if (response.data.success === true) {
        setDetail("");

        dispatch(userSlice.actions.setUserID(response.data.user._id));
        toast.success("Sign Up Successful");
        // Cookies.set("ecom_token_Byash", response.data.token, { expires: 7 });
        // dispatch(userSlice.actions.setCokies(response.data.token));
        console.log("Successfully Registered: ", response.data.user);
        // navigate("/login");
      } else {
        dispatch(userSlice.actions.setDetail(response.data.detail));
        console.log(response.data.detail);
      }
    } catch (error) {
      console.log("Error in saving/sending data", error);
    }
  };
export const logIn =
  (values, navigate, setDetail, toast, setForgot) => async (dispatch) => {

    axios.defaults.withCredentials = true;
    await axios
      .post("http://localhost:5000/user/login", values)
      .then((response) => {
        if (response.data.success === true) {
          dispatch(userSlice.actions.setUserID(response.data.user._id));
          dispatch(userSlice.actions.setUserName(response.data.user.firstName));
          // Cookies.set("ecom_token_Byash", response.data.token, { expires: 7 });
          dispatch(userSlice.actions.setCokies(response.data.token));

          //   setUserID(response.data.user._id);
          navigate("/home");
        } else {
          dispatch(userSlice.actions.setDetail(response.data.detail));
          // setDetail(response.data.detail);
          if (response.data.detail === "Logged In Failed / Wrong Password") {
            toast.warn("Wrong Credentials");
          }
          setForgot(true);
        }
      })
      .catch((err) => console.log("error in sending data", err));

    setTimeout(() => {
      setDetail("");
    }, 5000);
  };



  
export default userSlice.reducer;
