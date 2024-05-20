import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

function AdminComponent() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  console.log(name, role);
 
  const getUserDetail = () => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/home`, { withCredentials: true })
      .then((res) => {
        setName(res.data.user.firstName);
        setRole(res.data.user.role);
      })
      .catch((err) => console.log("PLease Log In to Get Access", err));
  };
  useEffect(() => {
    getUserDetail();
  }, []);
///////////////
  if (role !== "admin") {
    return (
      <div className="text-center text-red-500 text-xl mt-20">User Not allowed</div>
    );
  }
///////////////
  return (
    <div className="min-h-screen bg-slate-500 text-white">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row bg-slate-600 rounded-lg shadow-lg overflow-hidden">
          <aside className="w-full lg:w-1/3 p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <div className="mb-6">
              <span className="block text-lg font-semibold">
                Admin: Ashvary
              </span>
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
              <section>
                <h3 className="text-xl font-semibold mb-2">Reviews</h3>
                <Link to="allReviews" className="block hover:underline">
                  Check All Reviews
                </Link>
              </section>
            </nav>
          </aside>
          <main className="w-full p-6 bg-slate-700">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminComponent;
