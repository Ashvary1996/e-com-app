import { createSlice } from "@reduxjs/toolkit";

const orderData = localStorage.getItem("orderAllDetails")
  ? JSON.parse(localStorage.getItem("orderAllDetails"))
  : {};

const initialState = {
  contactInfo: orderData.contactInfo || {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
  },
  shippingInfo: orderData.shippingInfo || {
    address: "",
    city: "",
    pinCode: "",
    phoneNo: "",
    state: "",
  },
  orderInfo: orderData.orderInfo || {},
};

const cartSlice = createSlice({
  name: "cartForPayment",
  initialState,
  reducers: {
    setContactInfo(state, action) {
      const newContactInfo = action.payload;
      state.contactInfo = newContactInfo;
      localStorage.setItem("orderAllDetails", JSON.stringify({ ...state }));
      // console.log("newContactInfoFRomRedux",newContactInfo,);
    },
    setShippingInfo(state, action) {
      const newShippingInfo = action.payload;
      state.shippingInfo = newShippingInfo;
      localStorage.setItem("orderAllDetails", JSON.stringify({ ...state }));
    },
    setOrderInfo(state, action) {
      state.orderInfo = action.payload;
      localStorage.setItem("orderAllDetails", JSON.stringify({ ...state }));
    },
  },
});

export const { setContactInfo, setShippingInfo, setOrderInfo } =
  cartSlice.actions;
export default cartSlice.reducer;
