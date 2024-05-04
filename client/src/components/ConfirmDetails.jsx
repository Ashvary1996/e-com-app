import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckOutSteps from "./CheckOutSteps";
import axios from "axios";

function ConfirmDetails({}) {
  const { contactInfo, shippingInfo } = useSelector(
    (state) => state.cartForPayment
  );
  const [orderItems, setOrderItems] = useState([]);

  const fetchCartItems = () => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/user/cart/getCartItems`)
      .then((response) => {
        console.log("Cart_Data:", response.data);
        setOrderItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };
  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <CheckOutSteps activeStep={3} />
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Confirm Details
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Contact Information:</h3>
          <p>
            Name: {contactInfo.firstName} {contactInfo.lastName}
          </p>
          <p>Email: {contactInfo.email}</p>
          <p>Phone Number: {contactInfo.phoneNo}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Shipping Address:</h3>
          <p>Address: {shippingInfo.address}</p>
          <p>City: {shippingInfo.city}</p>
          <p>Pin Code: {shippingInfo.pinCode}</p>
          <p>Country: {shippingInfo.country}</p>
          <p>State: {shippingInfo.state}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
          <h2>Total Items : {orderItems.totalItems}</h2>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.items?.map((item) => (
                <tr key={item.cart_item_id}>
                  <td>{item.title}</td>
                  <td>₹ {item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between">
          <Link to="/contactInfo" className="text-indigo-600 hover:underline">
            Edit Contact Information
          </Link>
          <Link
            to="/shippingDetails"
            className="text-indigo-600 hover:underline"
          >
            Edit Shipping Details
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-md">
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDetails;
