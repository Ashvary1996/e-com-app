import React, { useState } from "react";
import CheckOutSteps from "./CheckOutSteps";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShippingInfo } from "../redux/cartSlice";

function ShippingDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shippingInfo = useSelector(
    (state) => state.cartForPayment.shippingInfo
  );

  const { address, city, pinCode, state } = shippingInfo;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setShippingInfo({
        ...shippingInfo,
        [name]: value,
      })
    );
  };

  const shippingSubmit = (e) => {
    e.preventDefault();
    console.log("clicked", shippingInfo);

    navigate("/confirmDetails");
  };

  return (
    <div className="container mx-auto py-8">
      <CheckOutSteps activeStep={1} />
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Shipping Details
        </h2>
        <form
          className="shippingForm"
          encType="multipart/form-data"
          onSubmit={shippingSubmit}
        >
          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-600 mb-2">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-600 mb-2">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* Pin Code */}
          <div className="mb-4">
            <label htmlFor="pinCode" className="block text-gray-600 mb-2">
              Pin Code
            </label>
            <input
              id="pinCode"
              name="pinCode"
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="state" className="block text-gray-600 mb-2">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          <input
            type="submit"
            value="Continue"
            className="block bg-indigo-500 text-white p-2 rounded-md w-full cursor-pointer"
            disabled={!state}
          />
        </form>
      </div>
    </div>
  );
}

export default ShippingDetails;
