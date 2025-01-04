import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckOutSteps from "./CheckOutSteps";
import axios from "axios";

function ConfirmDetails() {
  let loading = false;
  const navigate = useNavigate();
  const { contactInfo, shippingInfo } = useSelector(
    (state) => state.cartForPayment
  );
  // console.log(contactInfo, shippingInfo);
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
    setTotalPayableAmount(Math.ceil(totalPayable));
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
  // console.log(totalPayableAmount);
  ///////////////////////////////////////
  const handlePayment = async () => {
    const allData = {
      contactInfo,
      shippingInfo,
      thumbnail: orderItems.thumbnail,
      items: orderItems.items,
      totalItems: calculateTotalQuantity(),
      totalPayableAmount: totalPayableAmount,
    };
    // console.log("allData", allData);
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
        amount: totalPayableAmount * 100, // Razorpay accepts amount in paise
        currency: "INR",
        name: "Legion E-Com",
        description: "Payment of Items From E-Com Website",
        image:
          "https://assets.materialup.com/uploads/6201b674-8e98-40a9-9ad5-24f2cb5cd0f0/preview.gif",
        order_id: order.id,
        handler: async (response) => {
          if (response.error) {
            // If there is an error during payment
            console.error("Payment error:", response.error);
            navigate("/user/order/paymentFailed", {
              state: { msg: response.error },
            });
          }
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

            if (res.data.success === true) {
              navigate(
                `/paymentsuccess?reference=${res.data.razorpay_payment_id}`
              );
            }
          } catch (error) {
            console.error("Error creating  order on server :", error);
            navigate(`user/order/paymentFailed`, { state: { msg: error } });
          }
        },
        // contactInfo, shippingInfo
        prefill: {
          name: `${contactInfo.firstName + " " + contactInfo.lastName}`,
          email: `${contactInfo.email}`,
          contact: `${contactInfo.phoneNo}`,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        payment_options: {
          card: true,
          wallet: {
            wallets: ["upi", "cards"],
          },
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
    <div className="container mx-auto px-4 py-8">
      <CheckOutSteps activeStep={3} />

      <h2 className="text-xl md:text-2xl font-semibold text-center mt-4">
        Confirm Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Contact and Shipping Details */}
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="bg-white p-6 md:p-8 rounded-md shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-2">
              Contact Information:
            </h3>
            <p>
              Name: {contactInfo.firstName} {contactInfo.lastName}
            </p>
            <p>Email: {contactInfo.email}</p>
            <p>Phone Number: {contactInfo.phoneNo}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 md:p-8 rounded-md shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-2">
              Shipping Address:
            </h3>
            <p>Address: {shippingInfo.address}</p>
            <p>City: {shippingInfo.city}</p>
            <p>Pin Code: {shippingInfo.pinCode}</p>
            <p>Country: {shippingInfo.country}</p>
            <p>State: {shippingInfo.state}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-md shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              Order Details:
            </h3>
            <table className="w-full border-collapse border-spacing-0">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-sm md:text-base">Item</th>
                  <th className="py-2  text-center text-sm md:text-base">
                    Price
                  </th>
                  <th className="py-2 text-center text-sm md:text-base">
                    Quantity
                  </th>
                  <th className="py-2 text-center text-sm md:text-base">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.items?.map((item) => (
                  <tr key={item.cart_item_id} className="border-b">
                    <td className="py-2 text-sm md:text-base">{item.title}</td>
                    <td className="py-2 text-center text-sm md:text-base">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-2 text-center text-sm md:text-base">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-center text-sm md:text-base">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-4">
                  <td colSpan="3" className="py-2 font-semibold text-left">
                    Total:
                  </td>
                  <td className="py-2 max-w-full font-semibold">
                  ₹{calculateTotalAmount().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="py-2 font-semibold text-left">
                    Delivery Charge:
                  </td>
                  <td className="py-2 font-semibold">{deliveryFee}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="py-2 font-semibold text-left">
                    Discount:
                  </td>
                  <td className="py-2 font-semibold">
                    ₹{calculateDiscount().toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-200">
                  <td colSpan="3" className="py-2 font-semibold text-left">
                    Total Payable Amount:
                  </td>
                  <td className="py-2 font-semibold ">₹{totalPayableAmount}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={handlePayment}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition w-full md:w-auto"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Links */}
      <div className="flex flex-col md:flex-row justify-around items-center mt-6 space-y-4 md:space-y-0">
        <Link
          to="/contactInfo"
          className="text-indigo-600 hover:underline text-sm md:text-base"
        >
          Edit Contact Information
        </Link>
        <Link
          to="/shippingDetails"
          className="text-indigo-600 hover:underline text-sm md:text-base"
        >
          Edit Shipping Details
        </Link>
      </div>
    </div>
  );
}

export default ConfirmDetails;
