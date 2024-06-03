import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const UpdateOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/order/getAllOrders`
        );
        const paidOrders = response.data.order.filter(
          (order) =>
            order.paymentInfo.status === "Paid" &&
            order.orderStatus !== "Delivered"
        );
        setOrders(paidOrders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(orderId, newStatus);
    try {
      await axios.put(
        `${process.env.REACT_APP_HOST_URL}/order/admin/updateOrder/${orderId}`,
        {
          orderStatus: newStatus,
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.razorpayOrderId === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.log("orderId : ", orderId, error);
    }
  };

  const handleStatusChange = (orderId, e) => {
    const newStatus = e.target.value;
    updateOrderStatus(orderId, newStatus);
    toast.info(`Order-Updated to ${newStatus}`);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.razorpayOrderId.includes(searchTerm) ||
      order.userId.includes(searchTerm) ||
      order.orderStatus.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer />
      <div className="py-8">
        <h2 className="text-2xl leading-tight mb-4">Update Orders</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, User ID or Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" text-black block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal bg-slate-100">
            <thead>
              <tr>
                <th className="px-4 py-3">S.no</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total Price</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => (
                <tr key={order.razorpayOrderId}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{order.razorpayOrderId}</td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{order.totalPrice}</td>
                  <td className="px-4 py-3">{order.orderStatus}</td>
                  <td className="px-4 py-3">{order.paymentInfo.status}</td>
                  <td className="px-4 py-3">
                    {order.orderStatus !== "Delivered" && (
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order.razorpayOrderId, e)
                        }
                        className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-2 py-1 pr-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value={order.orderStatus}>
                          {order.orderStatus}
                        </option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrders;
