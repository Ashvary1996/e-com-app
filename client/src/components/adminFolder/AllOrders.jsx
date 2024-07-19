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
    <div className="container mx-auto p-4">
      <div className="py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">
            Orders: {data.total_orders}
          </h2>
          <div className="flex items-center mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 px-4 py-2 mr-4 mb-2 sm:mb-0 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full sm:w-36 px-4 py-2 rounded bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
        <div className="overflow-x-auto">
          <div className=" overflow-x-auto h-[60vh]  ">
            <table className="min-w-full leading-normal overflow-x-auto h-[60vh]  ">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200">S.no</th>
                  <th
                    onClick={() => sortOrders("createdAt")}
                    className="px-4 py-2 cursor-pointer border-b border-gray-200"
                  >
                    Created At
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Order ID
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    User ID
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Total Price
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Order Status
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {searchedOrders.map((order, i) => (
                  <tr key={order.razorpayOrderId} className="hover:bg-gray-400 ">
                    <td className="px-4 py-2 border-b border-gray-200">
                      {i + 1}
                    </td> 
                    <td className="px-4 py-2 border-b border-gray-200">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {order.razorpayOrderId}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {order.userId}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {order.totalPrice}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {order.orderStatus}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      {order.paymentInfo.status}
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

export default AllOrders;
