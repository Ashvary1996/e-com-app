import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import addToCart from "../config/addToCartFn";
import { cartItemFn, logoutFn } from "../redux/userSlice";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

import { CardRating } from "../lib/CardRating";
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
  const [loading, setLoading] = useState(true);
  const [dImgCurosol, setCurosol] = useState({ itemId: "", images: [] });
  // console.log("dImgCurosol", dImgCurosol);
  const dispatch = useDispatch();
  // console.log("items", items, displayItems);
  const displayItemsRef = useRef(null);
  const location = useLocation();

  const handleScrollToDisplayItems = () => {
    if (displayItemsRef.current) {
      displayItemsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const fetchProducts = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/product/getallProducts`)
      .then((response) => {
        // console.log("Products Fetched");
        setItems(response.data.items);
        setDisplayItems(response.data.items);
        setLoading(false);
        ///////////
        const randomItems = [];
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(
            Math.random() * response.data.items.length
          );
          randomItems.push({
            itemId: response.data.items[randomIndex]._id,
            thumbnail: response.data.items[randomIndex].thumbnail,
          });
        }
        setCurosol(randomItems);
        ////////////
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(logoutFn(setUser, toast));
  };

  useEffect(() => {
    let updatedItems = [...items];

    if (sortBy) {
      updatedItems.sort((a, b) => {
        if (sortBy === "price_LtH") return a.price - b.price;
        if (sortBy === "price_HtL") return b.price - a.price;
        if (sortBy === "rating_LtH") return a.ratings - b.ratings;
        if (sortBy === "rating_HtL") return b.ratings - a.ratings;
        return 0;
      });
    }

    if (filterBy) {
      updatedItems = updatedItems.filter((item) => item.brand === filterBy);
    }

    if (searchQuery) {
      updatedItems = updatedItems.filter((item) => {
        const title = item.title?.toLowerCase() || "";
        const brand = item.brand?.toLowerCase() || "";
        return (
          title.includes(searchQuery.toLowerCase()) ||
          brand.includes(searchQuery.toLowerCase())
        );
      });
    }

    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;
    const currentItems = updatedItems.slice(startIndex, endIndex);

    setDisplayItems(currentItems);
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
  };

  const fetchCartItems = useCallback(() => {
    dispatch(cartItemFn(userID, setCartNumber));
  }, [dispatch, userID]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/home`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user.firstName);
        setuserID(res.data.user._id);
        setUserRole(res.data.user.role);
        setUserData(res.data.user);

        if (res.data.user._id) {
          fetchCartItems();
        }
      })
      .catch((err) => console.log("Please Log In to Get Access"));

    fetchProducts();
  }, [fetchCartItems, fetchProducts]);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setUserRole("user");
      setuserID(null);
      setCartNumber(0);
    }
  }, [user]);

  return (
    <div className="homePage  ">
      <Header
        user={user}
        userData={userData}
        role={userRole}
        cartNumber={cartNumber}
        logoutFn={logout}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <ToastContainer
        id="myContainer"
        closeOnClick={true}
        pauseOnFocusLoss={false}
      />

      <div className="flex flex-wrap justify-end p-4 space-x-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Sort By</option>
          <option value="price_LtH">Price: Low to High</option>
          <option value="price_HtL">Price: High to Low</option>
          <option value="rating_LtH">Rating: Low to High</option>
          <option value="rating_HtL">Rating: High to Low</option>
        </select>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Filter By</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="OPPO">Oppo</option>
          <option value="Huawei">Huawei</option>
          <option value="HP Pavilion">HP Pavilion</option>
          <option value="Infinix">Infinix</option>
        </select>
        {filterBy && (
          <button
            onClick={resetFilter}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Reset Filter
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        // /////////////////////////

        // <main className="productsDisplay pb-16">
        //   {searchQuery ? null : (
        //     <Carousel dImgCurosol={dImgCurosol} userID={userID} />
        //   )}
        //   <div
        //     ref={displayItemsRef}
        //     className="displayItems flex flex-wrap gap-5 mt-5 justify-center"
        //   >
        //     {displayItems.map((elem, i) => (
        //       <div
        //         key={i}
        //         className="sProduct relative flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
        //       >
        //         <Link to={`/item/${elem._id}`} state={{ userID: userID }}>
        //           <img
        //             className="w-full h-48 rounded-lg mb-3 scale-100 hover:scale-110 transition-transform duration-300 ease-in-out"
        //             src={elem.thumbnail}
        //             alt="Product img"
        //           />
        //         </Link>
        //         <div className="sp2 text-center">
        //           <p className="font-semibold text-lg">
        //             {elem.title.slice(0, 30)}
        //           </p>
        //           <p className="font-mono text-sm">{elem.brand}</p>
        //           <p className="font-sans text-lg font-medium">
        //             ₹ {Math.ceil(elem.price)}
        //           </p>
        //           <div className="description-container h-16 overflow-hidden mb-2">
        //             <p className="font-thin pdesc text-sm  ">
        //               {elem.description}
        //             </p>
        //           </div>

        //           <p className="text-sm">Rating: {Number(elem.ratings)}</p>
        //           <button
        //             className={`${
        //               !userID
        //                 ? "cursor-not-allowed bg-green-400 text-white"
        //                 : "hover:bg-green-700 text-sm transition duration-300 ease-in-out bg-green-600 text-white"
        //             } px-4 py-2 rounded-md`}
        //             // disabled={!userID}
        //             onClick={async () => {
        //               if (!userID)
        //                 return toast.info("You Need To Log in First", {
        //                   pauseOnFocusLoss: false,
        //                 });
        //               const itemId = elem._id;
        //               const title = elem.title;
        //               addToCart(
        //                 elem,
        //                 itemId,
        //                 title,
        //                 userID,
        //                 user,
        //                 fetchCartItems,
        //                 toast
        //               );
        //             }}
        //           >
        //             Add to Cart
        //           </button>
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // </main>

        <main className="productsDisplay pb-16">
          {searchQuery ? null : (
            <Carousel dImgCurosol={dImgCurosol} userID={userID} />
          )}
          <div
            ref={displayItemsRef}
            className=" displayItems grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-6 mt-5 px-4 "
          >
            {displayItems.map((elem, i) => (
              <div
                key={i}
                className="sProduct flex flex-col justify-between items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 h-full m-auto"
              >
                <Link
                  to={`/item/${elem._id}`}
                  state={{
                    userID: userID,
                    cartNumber: cartNumber,
                    from: location.pathname,
                  }}
                >
                  <img
                    className="w-full h-48 object-cover rounded-lg mb-3 scale-100 hover:scale-105 transition-transform duration-300 ease-in-out"
                    src={elem.thumbnail}
                    alt="Product img"
                  />
                </Link>
                <div className="sp2 text-center space-y-2">
                  <p className="font-semibold text-lg text-gray-800">
                    {elem.title.slice(0, 30)}
                  </p>
                  <p className="font-mono text-sm text-gray-500">
                    {elem.brand}
                  </p>
                  <p className="font-sans text-lg font-medium text-green-600">
                    ₹ {Math.ceil(elem.price)}
                  </p>
                  <div className="description-container h-16 overflow-hidden p-2">
                    <p className="font-medium text-sm text-gray-600 first-letter:uppercase">
                      {elem.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
                    {/* <span>Rating:</span> */}
                    <CardRating>{elem.ratings}</CardRating>
                  </div>
                  <button
                    className={`w-full px-4 py-2 rounded-md text-sm ${
                      !userID
                        ? "cursor-not-allowed bg-gray-300 text-gray-600"
                        : "bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
                    }`}
                    onClick={async () => {
                      if (!userID)
                        return toast.info("You Need To Log in First", {
                          pauseOnFocusLoss: false,
                        });
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
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
      {/* ///////////////////////// */}
      <footer className="fixed bottom-0 w-full bg-white shadow-md border-t">
        {!items.length ? (
          <Footer />
        ) : (
          <div className="paginationDiv flex justify-center space-x-4 py-1">
            {currentPage > 1 && (
              <p
                onClick={() => {
                  handlePrevPage();
                  handleScrollToDisplayItems();
                }}
                className="text-black font-medium cursor-pointer hover:text-teal-600"
              >
                {"<"} Previous
              </p>
            )}
            <p className="text-black font-medium">{currentPage}</p>
            {displayItems.length === itemsPerPage &&
              items.length > currentPage * itemsPerPage && (
                <p
                  onClick={() => {
                    handleNextPage();
                    handleScrollToDisplayItems();
                  }}
                  className="text-black font-medium cursor-pointer hover:text-teal-600"
                >
                  Next {">"}
                </p>
              )}
          </div>
        )}
      </footer>
      {items.length ? <Footer /> : null}
    </div>
  );
}

export default HomePage;
