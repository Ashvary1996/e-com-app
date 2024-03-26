import React from "react";
import { Link } from "react-router-dom";
import logo from "../items/logo.png";

function Header({
  user,
  cartNumber,
  logoutFn,
  handleSearchChange,
  searchQuery,
}) {
  return (
    <header className="homeHeader p-1 flex bg-teal-500 justify-between sticky top-0 z-50">
      <div className="w-[80px]">
        <img className="rounded-full w-14 h-14 " src={logo} alt="logo" />
      </div>
      {/* search bar */}
      <div className="w-[40%] flex m-auto align-middle justify-center">
        <input
          className="w-[80%] h-10 text-center rounded-s-2xl"
          type="text"
          placeholder="Search for Products/Brands"
          autoComplete="on"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <button className="w-[20%] bg-slate-500 hover:bg-slate-400 rounded-e-2xl">
          SearchIcon
        </button>
      </div>
      <div className="w-[20%] ">
        <div className="flex justify-around mt-1 m-auto">
          <div className="dropdown relative inline-block ">
            <button className="dropbtn">{user ? user : "Guest"}</button>
            <div className="dropdown-content">
              {!user ? (
                <p>
                  <Link to="/login">Sign in</Link>
                </p>
              ) : (
                <>
                  <p onClick={logoutFn}> Log-out</p>
                  {/* <p>Help</p> */}
                </>
              )}
            </div>
          </div>
          {user ? (
            <Link to={"/cart"} className="p-3 bg-white">
              Cart <i>{cartNumber}</i>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
