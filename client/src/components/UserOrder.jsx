import React, { useEffect, useState } from "react";
import axios from "axios";

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelivered, setShowDelivered] = useState(false);
 
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
        className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        {showDelivered ? "Show Undelivered Orders" : "Show Delivered Orders"}
      </button>
      {sortedOrders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="space-y-8">
          <h2>Current Orders</h2>
          {sortedOrders.map((order, i) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h1>{i + 1}</h1>
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
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
              <div className="border-t border-gray-200 pt-4">
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
                <h3 className="text-lg font-semibold mb-2">
                  Payment Information
                </h3>
                <p className="text-gray-600">
                  Payment ID: {order.paymentInfo.id}
                </p>
                <p className="text-gray-600">
                  Total Amount Paid: {order.totalPrice}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center mb-2">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <p className="text-gray-800">{item.name}</p>
                      <p className="text-gray-600">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrder;
