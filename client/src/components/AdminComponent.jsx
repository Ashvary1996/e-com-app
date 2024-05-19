import React from "react";
import { Link, Outlet } from "react-router-dom";

function AdminComponent() {
  return (
    <>
      <br />
      <div className="flex bg-slate-500">
        <div className="w-1/3">
          <h2>Admin Dashboard</h2>
          <div>Admin : {"Ashvary"}</div>
          <hr />
          <div className="d-flex flex-col">
            <h1><i>Products</i></h1>
            <Link to="addProduct">Add Products</Link><br />
            <Link to="allProducts">View Products</Link>
            <br />
            {/* <Link>Get All Brands</Link> */}
            <hr />
          </div>
          <div className="d-flex flex-col">
            <h1><i>Orders</i></h1>
            <Link to="updateOrder">Update Order</Link>
            <br />
            <Link to={"allOrders"}>Check All Orders</Link>
            <hr />
          </div>
          <div className="d-flex flex-col">
            <h1><i>Customers</i></h1>
            <Link to={"allMembers"}>View All Members</Link>

            <hr />
          </div>
          <div className="d-flex flex-col">
            <h1><i>Reviews</i></h1>
            <Link to={"allReviews"}>Check All Reviews </Link>

            <hr />
          </div>
        </div>
        {/* /////////////////// */}
        {/* ///displaying based on above click */}
        <div>
          main display
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminComponent;
