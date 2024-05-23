import React, { useState, useEffect } from "react";
import axios from "axios";

const AllOrders = () => {
  const [data, setData] = useState({ total_orders: "" });
  const [orders, setOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/order/getAllOrders`
        );
        setData(response.data);
        setOrders(response.data.order);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  const sortOrders = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = filterStatus
    ? sortedOrders.filter(
        (order) =>
          order.paymentInfo.status === filterStatus ||
          order.orderStatus === filterStatus
      )
    : sortedOrders;

  const searchedOrders = searchQuery
    ? filteredOrders.filter(
        (order) =>
          order.razorpayOrderId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.paymentInfo.status
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : filteredOrders;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
          <h2 className="text-2xl leading-tight">
            Orders: {data.total_orders}
          </h2>

          <div className="text-end flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mr-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th
                    onClick={() => sortOrders("createdAt")}
                    className="cursor-pointer"
                  >
                    Created At
                  </th>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Total Price</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {searchedOrders.map((order, i) => (
                  <tr key={order.razorpayOrderId}>
                    <td>{i + 1}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.razorpayOrderId}</td>
                    <td>{order.userId}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.paymentInfo.status}</td>
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

export default AllOrders;
