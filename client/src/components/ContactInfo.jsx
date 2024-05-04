import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContactInfo } from "../redux/cartSlice";
import CheckOutSteps from "./CheckOutSteps";
import { useNavigate } from "react-router";

function ContactInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.cartForPayment.contactInfo);
  const { firstName, lastName, email, phoneNo } = contactInfo;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setContactInfo({ ...contactInfo, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/shippingDetails");
  };

  return (
    <div className="container mx-auto py-8">
      <CheckOutSteps activeStep={0} />
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Contact Information
        </h2>
        <form
          className="shippingForm"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-600 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-600 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phoneNo" className="block text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNo"
              name="phoneNo"
              type="tel"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
          </div>

          <input
            type="submit"
            value="Proceed To Shipping Form "
            className="block bg-indigo-500 text-white p-2 rounded-md w-full cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}

export default ContactInfo;
