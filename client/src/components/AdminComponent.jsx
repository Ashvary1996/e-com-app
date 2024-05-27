import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function AdminComponent() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalOrdersPlaced: 0,
    orderInProgress: 0, 
    totalOrderDelivered: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  // console.log(data.orderInProgress);
  useEffect(() => {
    const getUserDetail = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${process.env.REACT_APP_HOST_URL}/home`, {
          withCredentials: true,
        });
        setName(res.data.user.firstName);
        setRole(res.data.user.role);
      } catch (err) {
        console.log("Please Log In to Get Access", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatistics = async () => {
      try {
        const userData = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/user/admin/getAllusers`
        );

        let countAdmin = 0;
        userData.data.listofUser.forEach((user) => {
          if (user.role === "admin") {
            countAdmin++;
          }
        });

        const ordersData = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/order/getAllOrders`
        );

        let totalOrdersPlaced = 0;
        let countOrderInProgress = 0;
        let countTotalOrderDelivered = 0;

        ordersData.data.order.forEach((order, i) => {
          // console.log(i + 1, order.orderStatus);
          if (order.paymentInfo.status === "Paid") {
            totalOrdersPlaced++;
          }
          if (
            order.orderStatus === "Proceed to Shipping" ||
            order.orderStatus === "Shipped"
          ) {
            countOrderInProgress++;
          }
          if (order.orderStatus === "Delivered") {
            // console.log(order.orderStatus);
            countTotalOrderDelivered++;
          }
        });

        setData({
          totalUsers: userData.data.total_users,
          totalAdmins: countAdmin,
          totalOrdersPlaced,
          orderInProgress: countOrderInProgress,
          totalOrderDelivered: countTotalOrderDelivered,
        });
      } catch (err) {
        console.log("Failed to fetch statistics", err);
      }
    };

    getUserDetail();
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white text-xl mt-20">Loading...</div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        User Not allowed
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-500 text-white ">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row bg-slate-600 rounded-lg shadow-lg overflow-hidden">
          <aside className="w-full lg:w-1/4 p-6 bg-slate-700 lg:bg-slate-600">
            <h2 className="text-2xl font-bold mb-4">
              <Link to="/user/admin" className="block mb-1 hover:underline">
                Admin Dashboard
              </Link>
            </h2>
            <div className="mb-6">
              <span className="block text-lg font-semibold">Admin: {name}</span>
            </div>
            <nav className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-2">Products</h3>
                <Link to="addProduct" className="block mb-1 hover:underline">
                  Add Products
                </Link>
                <Link to="allProducts" className="block hover:underline">
                  View Products
                </Link>
              </section>
              <hr className="border-slate-400" />
              <section>
                <h3 className="text-xl font-semibold mb-2">Orders</h3>
                <Link to="updateOrder" className="block mb-1 hover:underline">
                  Update Order
                </Link>
                <Link to="allOrders" className="block hover:underline">
                  Check All Orders
                </Link>
              </section>
              <hr className="border-slate-400" />
              <section>
                <h3 className="text-xl font-semibold mb-2">Customers</h3>
                <Link to="allMembers" className="block hover:underline">
                  View All Members
                </Link>
              </section>
              <hr className="border-slate-400" />
            </nav>
          </aside>
          <main className="w-full lg:w-3/4 p-6 bg-slate-700">
            {location.pathname === "/user/admin" ? (
              <div className="space-y-6">
                <div className="text-2xl font-bold">Dashboard Overview</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-600 rounded-lg shadow">
                    <div className="text-xl font-semibold">Total Users</div>
                    <div className="text-3xl">{data.totalUsers}</div>
                  </div>

                  <div className="p-4 bg-slate-600 rounded-lg shadow">
                    <div className="text-xl font-semibold">Total Admins</div>
                    <div className="text-3xl">{data.totalAdmins}</div>
                  </div>

                  <div className="p-4 bg-slate-600 rounded-lg shadow">
                    <div className="text-xl font-semibold">
                      Total Orders (Paid)
                    </div>
                    <div className="text-3xl">{data.totalOrdersPlaced}</div>
                  </div>
                  <div
                    className={`p-4 bg-slate-600 rounded-lg shadow  ${
                      data.orderInProgress > 0 ? "bg-orange-500" : "bg-orange-500"
                    }`}
                  >
                    <Link to={"/user/admin/updateOrder"}>
                      <div className="text-xl font-semibold">
                        Order In Progress..
                      </div>
                      <div className="text-3xl">{data.orderInProgress}</div>
                    </Link>
                  </div>
                  <div className="p-4 bg-slate-600 rounded-lg shadow">
                    <div className="text-xl font-semibold">Order Delivered</div>
                    <div className="text-3xl">{data.totalOrderDelivered}</div>
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminComponent;
