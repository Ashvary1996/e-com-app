import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../items/logo.png";
import { RiMenuSearchLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";

function Header({
  user,
  userData,
  cartNumber,
  logoutFn,
  handleSearchChange,
  searchQuery,
  role,
}) {
  const navigate = useNavigate();

  return (
    <header className="homeHeader p-2 bg-teal-500 flex flex-wrap justify-between items-center sticky top-0 z-50 w-full sm:flex-nowrap">
      <div className="d1 flex-shrink-0">
        <Link to="/">
          <img
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
            src={logo}
            alt="logo"
          />
        </Link>
      </div>

      <div className="d2 mx-4 flex items-center    ">
        <input
          className="flex-grow h-10 px-4 rounded-l-2xl border-none text-center"
          type="text"
          placeholder="Search for Products/Brands"
          autoComplete="on"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="w-14 h-10 flex items-center justify-center bg-white rounded-r-2xl">
          <RiMenuSearchLine size={24} className="text-gray-500" />
        </button>
      </div>

      <div className="rbox d3   
      ">
        {role === "admin" && (
          <Link
            to="/user/admin"
            className="bg-green-500 p-2 text-lg font-medium rounded hover:bg-green-700 text-white"
          >
            Admin
          </Link>
        )} 

        <div className="dropdown-container relative">
          <button
            className={`dropdown-toggle p-2 text-lg font-medium rounded text-white bg-green-500 hover:bg-green-700`}
          >
            {user ? user : "Guest"}
          </button>

          <div className="dropdown-content absolute right-0 mt-2 w-48 p-2 bg-slate-600 shadow-lg rounded z-50">
            {!user ? (
              <Link to="/login" className="block hover:bg-gray-300">
                Sign in
              </Link>
            ) : (
              <>
                <button
                  onClick={() =>
                    navigate("/user/editProfile", {
                      state: { userData },
                    })
                  }
                  className="block text-left hover:bg-gray-300"
                >
                  View / Edit Profile
                </button>
                <Link
                  to="/user/order"
                  className="block text-left hover:bg-gray-300"
                >
                  My Orders
                </Link>
                <Link
                  onClick={logoutFn}
                  className="block text-left hover:bg-gray-200"
                >
                  Log out
                </Link>
              </>
            )}
          </div>
        </div>

        {user && (
          <Link
            to="/cart"
            className="relative p-2 flex items-center bg-white rounded"
          >
            <FiShoppingCart size={24} className="text-gray-500" />
            {cartNumber > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartNumber}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
