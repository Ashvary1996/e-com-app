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
    <header className=" p-2 bg-teal-500 flex flex-wrap justify-between items-center sticky top-0 z-50 w-full sm:flex-nowrap  ">
      <div className="flex items-center justify-start ">
        <Link to="/">
          <img
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
            src={logo}
            alt="logo"
            width={64}
            height={64}
          />
        </Link>
      </div>
      {/* Search Bar */}
      <div className="order-last w-full mt-1 sm:mt-0 sm:order-none sm:w-auto sm:flex-1  sm:mx-4 ">
        <div className=" mt-1 relative flex items-center  sm:mx-auto sm:max-w-md  focus-within:ring-1 focus-within:ring-orange-500   focus-within:rounded-lg">
          <input
            className="w-full h-10 px-4 rounded-l-lg  border-none outline-none"
            type="text"
            placeholder="Search for Products/Brands"
            autoComplete="on"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="h-10 px-4 bg-white text-white rounded-r-lg 
          hover:bg-gray-200 "
          >
            <RiMenuSearchLine size={24} className="text-gray-500 " />
          </button>
        </div>
      </div>
      {/* User & Cart */}
      <div
        className="flex items-center justify-end w-fit space-x-4    
      "
      >
        {user && (
          <Link
            to="/cart"
            state={{ userID: userData._id }}
            className="relative p-2 bg-white  rounded-full hover:bg-gray-100"
          >
            <FiShoppingCart size={24} className="text-gray-500" />
            {cartNumber > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartNumber}
              </span>
            )}
          </Link>
        )}

        <div className="dropdown-container relative inline-block">
          <button
            className={`dropdown-toggle p-2 text-lg font-medium rounded text-white bg-green-500 hover:bg-green-700`}
          >
            {user ? user : "Guest"}
          </button>

          <div
            className="
          dropdown-content hidden absolute right-0 w-48 p-2 bg-white shadow-lg rounded z-50"
          >
            {!user ? (
              <Link
                to="/login"
                className="block hover:bg-gray-300  text-left  p-2 w-full"
              >
                Sign in
              </Link>
            ) : (
              <>
                <div className="hover:bg-orange-500  text-lg  hover:text-white rounded   text-orange-500 font-medium  p-2 w-full">
                  {role === "admin" && <Link to="/user/admin">Admin Menu</Link>}
                </div>
                <button
                  onClick={() =>
                    navigate("/user/editProfile", {
                      state: { userData },
                    })
                  }
                  className="block text-left hover:bg-gray-300 p-2 w-full"
                >
                  View Profile
                </button>
                <Link
                  to="/user/order"
                  className="block text-left hover:bg-gray-300 p-2 w-full"
                >
                  My Orders
                </Link>
                <Link
                  onClick={logoutFn}
                  className="block text-left hover:bg-orange-400 bg-gray-400 p-2 w-full hover:text-white "
                >
                  Log out
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
