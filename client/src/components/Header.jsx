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
  const data = userData;
  console.log("userData from header,", data);
  const navigate = useNavigate();
  return (
    <header className="homeHeader p-1 flex bg-teal-500 justify-between sticky top-0 z-50">
      <div className="w-[80px]">
        <img className="rounded-full w-14 h-14 " src={logo} alt="logo" />
      </div>
      {/* search bar */}
      <div className="w-[40%] flex m-auto align-middle justify-center  first-letter:">
        <input
          className="w-[80%] h-10 text-center rounded-s-2xl  "
          style={{ border: "none" }}
          type="text"
          placeholder="Search for Products/Brands"
          autoComplete="on"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <button className="w-1/5 sm:w-[20%]   ">
          <RiMenuSearchLine
            size={"40px"}
            className=" sm:w-[40px] bg-white rounded-e-2xl text-gray-500"
          />
        </button>
      </div>

      <div className="w-[20%] ">
        <div className="flex justify-around mt-1 m-auto">
          {role == "admin" && (
            <Link
              to={"/user/admin"}
              className="bg-green-500 p-3   hover:bg-green-700 textlg"
            >
              Admin Menu
            </Link>
          )}
          <div className="dropdown relative inline-block ">
            <button className="dropbtn">{user ? user : "Guest"}</button>
            <div className="dropdown-content">
              {!user ? (
                <p>
                  <Link to="/login">Sign in</Link>
                </p>
              ) : (
                <>
                  <p
                    onClick={() =>
                      navigate("/user/editProfile", {
                        state: { userData: data },
                      })
                    }
                  >
                    Edit Profile
                  </p>
                  <p onClick={logoutFn}> Log-out</p>
                  {/* <p>Help</p> */}
                </>
              )}
            </div>
          </div>
          {user ? (
            <Link to={"/cart"} className="p-3 bg-white flex items-center">
              <FiShoppingCart
                className=" mr-1sm:w-[40px] bg-white rounded-e-2xl  "
                size={"23px"}
              />
              <sup className="text-base"> {cartNumber}</sup>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
