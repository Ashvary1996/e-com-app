import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cartForPayment: cartReducer,
  },
});
