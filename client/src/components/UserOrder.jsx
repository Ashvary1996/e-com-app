import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelivered, setShowDelivered] = useState(false);
  const location = useLocation();
  // console.log(location);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/order/getmyOrders`,
          {
            withCredentials: true,
          }
        );
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  console.log(orders);
  const filteredOrders = showDelivered
    ? orders.filter((order) => order.orderStatus === "Delivered")
    : orders.filter((order) => order.orderStatus !== "Delivered");

  const sortedOrders = filteredOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Orders</h1>
      <button
        onClick={() => setShowDelivered(!showDelivered)}
        className={`mb-4   px-4 py-2 rounded text-white font-bold ${
          showDelivered
            ? "bg-orange-400 hover:bg-orange-500  "
            : "bg-green-400 hover:bg-green-500"
        }`}
      >
        {showDelivered ? "Show Undelivered Orders" : "Show Delivered Orders"}
      </button>
      {sortedOrders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {/* <h2>Current Orders</h2> */}
          {sortedOrders.map((order, i) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-xl border-2"
            >
              <div className="mb-4 m-auto">
                <h1 className="text-center text-3xl font-semibold">{i + 1}</h1>
                <h1 className="text-lg font-semibold mb-2">Order Details</h1>
                <h2>Order ID: {order._id}</h2>
                <p className="text-gray-600">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={` text-xl
                       ${
                         order.orderStatus === "Delivered"
                           ? "text-green-500 font-bold"
                           : "text-orange-600 font-semibold"
                       }`}
                  >
                    {order.orderStatus}
                  </span>
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4 ">
                <h3 className="text-lg font-semibold mb-2">
                  Shipping Information
                </h3>
                <p className="text-gray-600">
                  Address: {order.shippingInfo.address}
                </p>
                <p className="text-gray-600">City: {order.shippingInfo.city}</p>
                <p className="text-gray-600">
                  State: {order.shippingInfo.state}
                </p>
                <p className="text-gray-600">
                  Pin Code: {order.shippingInfo.pinCode}
                </p>
                <p className="text-gray-600">
                  Phone No: {order.shippingInfo.phoneNo}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center mb-2">
                    <Link
                      to={`/item/${item.productId}`}
                      state={{
                        from: location.pathname,
                        userID: orders[0].userId,
                      }}
                    >
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover mr-4"
                      />
                    </Link>

                    <div>
                      <p className="text-gray-800">{item.name}</p>
                      <p className="text-gray-600">
                        ₹{item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4  ">
                <h3 className="text-lg font-semibold mb-2">
                  Payment Information
                </h3>
                <p className="text-gray-600">
                  Payment ID: {order.paymentInfo.id}
                </p>
                <p className="text-gray-800 font-medium rounded-md bg-slate-300 py-2 mt-2  p-2 text-center">
                  Total Amount Paid: ₹{order.totalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrder;
