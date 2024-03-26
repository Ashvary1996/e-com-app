import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getToken,
  getUserID,
  removeToken,
  removeUserID,
} from "../config/authTokenUser";
import Loader from "../components/Loader";
import addToCart from "../config/addToCartFn";
import Header from "../components/Header";

function HomePage() {
  const userID = getUserID();
  const [user, setUser] = useState();
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
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
    setCurrentPage(1);
    // console.log("searchQuery", searchQuery);
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

  const [isHovered, setIsHovered] = useState(false);
  const toggleHover = () => setIsHovered(!isHovered);

  return (
    <div className="homePage">
      {/* Header  */}
      <Header
        user={user}
        cartNumber={cartNumber}
        logoutFn={logoutFn}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

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
          <>
            <p className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
              Display Items : {displayItems.length}
            </p>
            <button
              onClick={resetFilter}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
            >
              Reset Filter
            </button>
          </>
        )}
      </div>
      {/* ////////////////////  Main Div /////////////////// */}
      {laoding ? <Loader /> : null}

      <main className="productsDisplay">
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {displayItems.map((elem, i) => (
            <div
              key={i}
              className="sProduct relative flex flex-col items-center"
            >
              <Link
                to={{
                  pathname: `/item/${elem._id}`,
                  state: { item: elem },
                }}
              >
                <img
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  src={elem.thumbnail}
                  alt="Product imge"
                />
              </Link>
              <div className="sp2 text-center">
                <p className="font-semibold text-lg mb-1">{elem.title}</p>
                <p className="font-mono text-sm mb-1">{elem.brand}</p>
                <p className="font-sans text-lg">
                  ₹ {Math.ceil(elem.price * 83.01)}
                </p>

                <div className="description-container h-16 overflow-hidden mb-2">
                  <p className="font-thin pdesc text-sm">{elem.description}</p>
                </div>
                <p className="text-sm">Rating: {Number(elem.rating)}</p>
                <button
                  onClick={() => {
                    addToCart(elem._id, userID, user, fetchCartItems);
                    console.log("Items Details: ", elem);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm transition duration-300 ease-in-out"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* /////////////////// Footer  //////////////////// */}

      <footer
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        className={`transition-all duration-300 ${
          isHovered ? "fixed inset-x-0 bottom-0" : "relative"
        } bg-white shadow-md`}
      >
        <div className="paginationDiv flex justify-center space-x-4 py-1  ">
          <p
            onClick={() => {
              if (currentPage > 1) handlePrevPage();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:text-teal-600"
            }`}
          >
            {"<"} Previous
          </p>
          <p className="text-black font-medium">{currentPage}</p>
          <p
            onClick={() => {
              if (currentPage * itemsPerPage < items.length) handleNextPage();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer ${
              currentPage * itemsPerPage >= items.length
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:text-teal-600"
            }`}
          >
            Next {">"}
          </p>
        </div>
      </footer>

      {/* ///////////////////////////////////////////// */}
    </div>
  );
}

export default HomePage;
