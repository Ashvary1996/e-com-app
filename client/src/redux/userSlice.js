import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    userName: "",
    token: "",
    role: "",
    detail: "",
    totalCartNumber: "",
  },
  reducers: {
    setDetail: (state, action) => {
      state.detail = action.payload;
    },
    setUserID: (state, action) => {
      state.userId = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    setCokies: (state, action) => {
      state.token = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setCartNumber: (state, action) => {
      state.totalCartNumber = action.payload;
      // console.log("fromRedux", state.totalCartNumber);
    },
  },
});

// Defineing the signUp action creator
export const signUp =
  (userData, setDetail, toast, navigate) => async (dispatch) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/user/signup`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success === true) {
        setDetail("");

        // dispatch(userSlice.actions.setUserID(response.data.user._id));
        // alert("Sign Up Successful");
        toast.success("Sign Up Successfully");
        // console.log("Successfully Registered: ", response.data.user);
        setTimeout(() => {
          navigate("/login");
      }, 3000);
        // navigate("/login");
      } else {
        dispatch(userSlice.actions.setDetail(response.data.detail));
        console.log(response.data.detail, response.data.error);
        toast.warn(response.data.detail);
      }
    } catch (error) {
      console.log("Error in saving/sending data", error);
    }
  };
export const logIn =
  (values, navigate, setDetail, toast, setForgot) => async (dispatch) => {
    axios.defaults.withCredentials = true;
    await axios
      .post(`${process.env.REACT_APP_HOST_URL}/user/login`, values, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          dispatch(userSlice.actions.setUserID(response.data.user._id));
          dispatch(userSlice.actions.setUserName(response.data.user.firstName));
          dispatch(userSlice.actions.setUserRole(response.data.user.role));
          // Cookies.set("ecom_token_Byash", response.data.token, { expires: 7 });
          dispatch(userSlice.actions.setCokies(response.data.token));

          //   setUserID(response.data.user._id);
          navigate("/home");
        } else {
          dispatch(userSlice.actions.setDetail(response.data.detail));
          setDetail(response.data.detail);
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
export const logoutFn = (setUser, toast) => async (dispatch) => {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_URL}/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      console.log("Logged Out Successfully");

      setUser("");
      toast.info("USER Logged-Out");
    } else {
      console.error("Failed to log out:", response.data.msg);
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
export const cartItemFn = (userId, setCartNumber) => async (dispatch) => {
  axios.defaults.withCredentials = true;
  axios
    .get(`${process.env.REACT_APP_HOST_URL}/user/cart/getCartItems`, {
      userId: userId,
    })
    .then((response) => {
      setCartNumber(response.data.totalItems);
      dispatch(userSlice.actions.setCartNumber(response.data.totalItems));
      // console.log("responseCart", response.data.totalItems);
    })
    .catch((error) => {
      console.log("Error fetching cart items:", error);
    });
};

export default userSlice.reducer;
