import React, { useState, useEffect } from "react";
import axios from "axios";

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
        `${process.env.REACT_APP_HOST_URL}/order/admin/updateOrder/${String(
          orderId
        )}`,
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
      console.log(error);
    }
  };

  const handleStatusChange = (orderId, e) => {
    const newStatus = e.target.value;
    updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.razorpayOrderId.includes(searchTerm) ||
      order.userId.includes(searchTerm) ||
      order.orderStatus.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <h2 className="text-2xl leading-tight">Update Orders</h2>
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by Order ID, User ID or Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.razorpayOrderId}>
                    <td>{i + 1}</td>
                    <td>{order.razorpayOrderId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.paymentInfo.status}</td>
                    <td>
                      {order.orderStatus !== "Delivered" && (
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.razorpayOrderId, e)
                          }
                          className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
    </div>
  );
};

export default UpdateOrders;
