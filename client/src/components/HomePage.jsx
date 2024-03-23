import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../items/logo.png";
import {
  getToken,
  getUserID,
  removeToken,
  removeUserID,
} from "../config/authTokenUser";
import Loader from "./Loader";

function HomePage() {
  const [user, setUser] = useState();
  const userID = getUserID();
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [cartNumber, setCartNumber] = useState("");
  const [laoding, setLoading] = useState(true);

  console.log("displayItems", displayItems.length, laoding);
  const fetchProducts = () => {
    axios
      .get(`/user/allProducts`)
      .then((response) => {
        setItems(response.data.items);
        setDisplayItems(response.data.items);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const logoutFn = () => {
    setUser("");
    removeToken();
    removeUserID();
  };

  useEffect(() => {
    let updatedItems = [...items];

    if (sortBy) {
      updatedItems.sort((a, b) => {
        if (sortBy === "price_LtH") return a.price - b.price;
        if (sortBy === "price_HtL") return b.price - a.price;
        if (sortBy === "rating_LtH") return a.rating - b.rating;
        if (sortBy === "rating_HtL") return b.rating - a.rating;
        return 0;
      });
    }

    if (filterBy) {
      updatedItems = updatedItems.filter((item) => item.brand === filterBy);
    }
    ///////////////////////////////////////

    // Filtering items based on search query
    if (searchQuery) {
      updatedItems = updatedItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    /////////////// for pagination ////////////////////////

    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;
    const currentItems = updatedItems.slice(startIndex, endIndex);

    setDisplayItems(currentItems);
    ///////////////////////////////////////
  }, [
    items,
    sortBy,
    filterBy,
    currentPage,
    itemsPerPage,
    searchQuery,
    cartNumber,
  ]);

  const resetFilter = () => {
    setFilterBy("");
    setSortBy("");
    setDisplayItems(items);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // console.log("searchQuery", searchQuery);
  };

  const addToCart = (item_id) => {
    axios
      .post("/user/cart", {
        userId: userID,
        userName: user,
        productId: item_id,
      })
      .then((response) => {
        console.log(response.data);
        fetchCartItems();
      })
      .catch((err) => console.log(err));
  };
  const fetchCartItems = useCallback(() => {
    axios
      .post("/user/getCartItems", { userId: userID })
      .then((response) => {
        setCartNumber(response.data.totalItems);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [userID]);

  useEffect(() => {
    const jwttoken = getToken();
    if (jwttoken) {
      axios
        .get("/user/home", {
          headers: {
            token: `Bearer ${jwttoken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setUser(response.data.currentUser[0].firstName);
          // setUserId(response.data.currentUser[0]._id);
        })
        .catch((err) => console.log(err));
    }
    fetchProducts();
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <>
      <header className="homeHeader p-1  flex bg-teal-500    justify-between ">
        <div className="w-[80px]">
          <img className="rounded-full" src={logo} alt="logo" />
        </div>
        {/* search bar */}
        <div className="w-[40%] flex m-auto align-middle justify-center ">
          <input
            className="w-[80%] h-10 text-center rounded-s-2xl"
            type="text"
            placeholder="Search for Products"
            autoComplete="on"
            value={searchQuery}
            onChange={handleSearchChange}
            // Handle changes in search query
          />

          <button
            onClick={handleSearchChange}
            className="w-[20%] bg-slate-500 hover:bg-slate-400 rounded-e-2xl"
          >
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
                    <p>Help</p>
                  </>
                )}
              </div>
            </div>
            {user ? (
              <Link
                to={{ pathname: "/cart", state: { userId: userID } }}
                className="p-3 bg-white"
              >
                Cart <i>{cartNumber}</i>
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      {/* /////////////////////Sort and Filter with Reset filter option//////////////////////// */}
      <div>
        <div className="   flex justify-end">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Sort By</option>
            <option value="price_LtH">Price : Low to High</option>
            <option value="price_HtL">Price : High to Low</option>
            <option value="rating_LtH">Rating : Low to High</option>
            <option value="rating_HtL">Rating : High to Low</option>
            {/* Add more sorting options */}
          </select>
          {/* Filter dropdown */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Filter By</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung </option>
            <option value="OPPO">Oppo</option>
            <option value="Huawei">Huawei</option>
            <option value="HP Pavilion">HP Pavilion</option>
            <option value="Infinix">Infinix</option>
          </select>
        </div>
        {/* Button to reset filter */}
        {filterBy && (
          <button
            onClick={resetFilter}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Reset Filter
          </button>
        )}
      </div>
      {/* ////////////////////  Main Div /////////////////// */}
      {laoding ? <Loader /> : null}
      <main className="productsDisplay   ">
        <div className="flex flex-wrap gap-5 mt-5   ">
          {displayItems.map((elem, i) => (
            <div key={i} className="sProduct relative   m-auto">
              {/* <h1>{i + 1}</h1> */}
              <img
                className="w-[100%] h-[45%] m-auto"
                src={elem.thumbnail}
                alt="img"
              />
              <div className="sp2 mt-2 ">
                <p
                  className={`font-semibold ${
                    elem.title.length > 25 ? "text-sm " : ""
                  } `}
                >
                  {elem.title}
                </p>
                <p className="font-mono">{elem.brand}</p>
                <p className="font-sans">₹ {Math.ceil(elem.price * 83.01)}</p>
                <p className="font-thin pdesc">{elem.description}</p>
                <p>Rating : {Number(elem.rating)}</p>
                <button
                  onClick={() => addToCart(elem._id)}
                  className="absolute bottom-1   align-middle justify-center  bg-green-400 text-black hover:bg-green-500 p-1 text-sm rounded  "
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* /////////////////// Footer  //////////////////// */}

      <footer>
        <div className="paginationDiv flex justify-center space-x-4">
          <p
            onClick={() => {
              if (currentPage > 1) handlePrevPage();
            }}
            className={`cursor-pointer ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed  :"
                : "text-black"
            }`}
          >
            {"<"} Previous
          </p>
          <p>{currentPage}</p>
          <p
            onClick={() => {
              if (currentPage * itemsPerPage < items.length) handleNextPage();
            }}
            className={`cursor-pointer ${
              currentPage * itemsPerPage >= items.length
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
          >
            Next {">"}
          </p>
        </div>
      </footer>
      {/* ///////////////////////////////////////////// */}
    </>
  );
}

export default HomePage;
