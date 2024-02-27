import { createSlice } from "@reduxjs/toolkit";
import { setToken, removeToken, removeUserID } from "../config/authTokenUser";

const initialState = {
  token: null,
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      //   setToken(action.payload.token);
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    logoutSuccess: (state) => {
        removeUserID()
      removeToken();
    },
  },
});

export const { loginSuccess, logoutSuccess } = userSlice.actions;

export default userSlice.reducer;
