import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import { removeToken, removeUserID } from "../config/authTokenUser";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import addToCart from "../config/addToCartFn";
import { cartItemFn, logoutFn } from "../redux/userSlice";

function HomePage() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [userRole, setUserRole] = useState("user");
  const [userID, setuserID] = useState();
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;
  const [searchQuery, setSearchQuery] = useState("");
  const [cartNumber, setCartNumber] = useState(0);
  const [laoding, setLoading] = useState(true);
  const dispatch = useDispatch();
  ///////////////////////

  const fetchProducts = () => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/product/getallProducts`)
      .then((response) => {
        setItems(response.data.items);
        setDisplayItems(response.data.items);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const logout = () => {
    dispatch(logoutFn(setUser));
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
    dispatch(cartItemFn(userID, setCartNumber));
  }, [dispatch, userID]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/home`, { withCredentials: true })
      .then((res) => {
        // console.log(res.data);
        // console.log(res.data.user.firstName);
        setUser(res.data.user.firstName);
        setuserID(res.data.user._id);
        setUserRole(res.data.user.role);
        setUserData(res.data.user);
        if (res.data.user._id) {
          fetchCartItems();
        }
        // console.log(userData);
      })
      .catch((err) => console.log("PLease Log In to Get Access"));

    fetchProducts();
  }, [fetchCartItems]);

  const [isHovered, setIsHovered] = useState(false);
  const toggleHover = () => setIsHovered(!isHovered);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
  // };
  return (
    <div className="homePage">
      {/* Header  */}
      <Header
        user={user}
        userData={userData}
        role={userRole}
        cartNumber={cartNumber}
        logoutFn={logout}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <ToastContainer closeOnClick id="myContainer" />
      {/* /////////////////////Sort and Filter with Reset filter option//////////////////////// */}
      <div>
        <div className="   flex justify-end">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Sort By </option>
            <option value="price_LtH">Price : Low to High</option>
            <option value="price_HtL">Price : High to Low</option>
            <option value="rating_LtH">Rating : Low to High</option>
            <option value="rating_HtL">Rating : High to Low</option>
            {/* Will Add more sorting options */}
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
        {/*  */}

        {/*  */}
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
              <Link to={`/item/${elem._id}`} state={{ userID: userID }}>
                <img
                  className="w-full h-48 rounded-lg mb-3 scale-100 hover:scale-110 transition-transform duration-300 ease-in-out"
                  src={elem.thumbnail}
                  alt="Product img"
                />
              </Link>
              <div className="sp2 text-center">
                <p className={`font-semibold text-lg`}>
                  {elem.title.slice(0, 30)}
                </p>
                <p className="font-mono text-sm  ">{elem.brand}</p>
                <p className="font-sans text-lg font-medium">
                  ₹ {Math.ceil(elem.price * 83.01)}
                </p>

                <div className="description-container h-16 overflow-hidden mb-2">
                  <p className="font-thin pdesc text-sm">{elem.description}</p>
                </div>
                <p className="text-sm">Rating: {Number(elem.rating)}</p>
                <button
                  className={`${
                    !userID
                      ? "cursor-not-allowed bg-green-400 text-white"
                      : "hover:bg-green-700 text-sm transition duration-300 ease-in-out bg-green-600 text-white"
                  } px-4 py-2 rounded-md`}
                  disabled={!userID}
                  onClick={async () => {
                    const itemId = elem._id;
                    const title = elem.title;
                    addToCart(
                      elem,
                      itemId,
                      title,
                      userID,
                      user,
                      fetchCartItems,
                      toast
                    );

                    console.log("Items Details: ", elem);
                  }}
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
