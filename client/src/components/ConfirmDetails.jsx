import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckOutSteps from "./CheckOutSteps";
import axios from "axios";

function ConfirmDetails() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { contactInfo, shippingInfo } = useSelector(
    (state) => state.cartForPayment
  );
  const [orderItems, setOrderItems] = useState([]);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState("");

  const calculateTotalAmount = useCallback(() => {
    if (!orderItems || !orderItems.items) {
      return 0;
    }
    return orderItems.items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
  }, [orderItems]);

  const calculateTotalQuantity = useCallback(() => {
    if (!orderItems || !orderItems.items) {
      return 0;
    }
    return orderItems.items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    );
  }, [orderItems]);

  const calculateDiscount = useCallback(() => {
    const totalQuantity = calculateTotalQuantity();

    if (totalQuantity >= 10) {
      return 0.1 * calculateTotalAmount(); //10%
    } else if (totalQuantity >= 5 && totalQuantity < 10) {
      return 0.05 * calculateTotalAmount(); //5%
    } else {
      return 0;
    }
  }, [calculateTotalQuantity, calculateTotalAmount]);

  const calculateTotalPayableAmount = useCallback(() => {
    const totalAmount = calculateTotalAmount();
    const discount = calculateDiscount();
    const totalPayable = totalAmount - discount;
    setTotalPayableAmount(totalPayable);
    return totalPayable;
  }, [calculateTotalAmount, calculateDiscount]);

  const fetchCartItems = () => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/user/cart/getCartItems`)
      .then((response) => {
        // console.log("Cart_Data:", response.data);
        setOrderItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };
  ///////////////////////////////////////
  const handlePayment = async () => {
    const allData = {
      contactInfo,
      shippingInfo,
      items: orderItems.items,
      totalItems: calculateTotalQuantity(),
      amount: totalPayableAmount,
    };
    console.log("allData", allData);
    try {
      // Step 1: Create an order on the server
      const {
        data: { order },
      } = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/order/payment/create-order`,
        allData
      );

      // Step 2: Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_KEY_ID,
        amount: 2121 * 100, // Razorpay accepts amount in paise
        currency: "INR",
        name: "Legion E-Com",
        description: "Payment of Items From E-Com Website",
        image:
          "https://assets.materialup.com/uploads/6201b674-8e98-40a9-9ad5-24f2cb5cd0f0/preview.gif",
        order_id: order.id,
        handler: async (response) => {
          // Step 3: Verify payment and save order details
          const paymentData = {
            ...allData,
            paymentInfo: {
              id: response.razorpay_payment_id,
              status: "Paid",
            },
            razorpay_order_id: order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            paidAt: new Date().toISOString(),
          };

          try {
            const res = await axios.post(
              `${process.env.REACT_APP_HOST_URL}/order/razorpay/callback`,
              paymentData
            );
            console.log(res.data);

            if (res.data.success == true) {
              navigate(
                `/paymentsuccess?reference=${res.data.razorpay_payment_id}`
              );
            }

            // Handle success message or any other actions after successful order creation
          } catch (error) {
            console.error("Error saving order to database:", error);
            // Handle error
          }
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090009",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Step 4: Open Razorpay payment modal
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error creating order on server:", error);
      // Handle error
    }
  };
  ///////////////////////////////////////

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const deliveryFee = calculateTotalAmount() > 500 ? "Free" : "Rs. 50";
    setDeliveryFee(deliveryFee);
    calculateTotalPayableAmount();
  }, [orderItems, calculateTotalAmount, calculateTotalPayableAmount]);

  return (
    <div className="container mx-auto py-8">
      <CheckOutSteps activeStep={3} />

      <h2 className="text-2xl font-semibold text-center mt-2">
        Confirm Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="bg-white p-8 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-2">Contact Information:</h3>
            <p>
              Name: {contactInfo.firstName} {contactInfo.lastName}
            </p>
            <p>Email: {contactInfo.email}</p>
            <p>Phone Number: {contactInfo.phoneNo}</p>
          </div>
          <div className="bg-white p-8 rounded-md shadow-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Shipping Address:</h3>
            <p>Address: {shippingInfo.address}</p>
            <p>City: {shippingInfo.city}</p>
            <p>Pin Code: {shippingInfo.pinCode}</p>
            <p>Country: {shippingInfo.country}</p>
            <p>State: {shippingInfo.state}</p>
          </div>
        </div>
        <div className="md:col-span-2 p-2">
          <div className="bg-white p-8 rounded-md shadow-md">
            <div className="mb-4 border-2">
              <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-center">Price</th>
                    <th className="py-2 text-center">Quantity</th>
                    <th className="py-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.items?.map((item) => (
                    <tr key={item.cart_item_id}>
                      <td className="py-2">{item.title}</td>
                      <td className="py-2 text-center">₹ {item.price}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-center">
                        ₹ {item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="py-2 font-semibold text-right">
                      Total :
                    </td>
                    <td className="py-2 font-semibold">
                      ₹ {calculateTotalAmount().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 font-semibold text-right">
                      Delivery Charge :
                    </td>
                    <td className="py-2 font-semibold">{deliveryFee}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 font-semibold text-right">
                      Discount :
                    </td>
                    <td className="py-2 font-semibold">
                      ₹ {calculateDiscount().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 font-semibold text-right">
                      Total Payable Amount:
                    </td>
                    <td className="py-2 font-semibold">
                      ₹ {totalPayableAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePayment}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Link to="/contactInfo" className="text-indigo-600 hover:underline">
          Edit Contact Information
        </Link>
        <Link to="/shippingDetails" className="text-indigo-600 hover:underline">
          Edit Shipping Details
        </Link>
      </div>
    </div>
  );
}

export default ConfirmDetails;
