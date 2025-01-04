import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import addToCart from "../config/addToCartFn";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardRating } from "../lib/CardRating";

function ItemDescription() {
  const location = useLocation();
  const navigate = useNavigate();

  const { itemId } = useParams();
  const [item, setItem] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { userID = null } = location.state || {};
  const dataFromLocation = location.state;
  // console.log("userID", userID);
  // console.log("cartNumber", cartNumber);
  // console.log("item", item);
  // console.log("dataFromLocation", dataFromLocation);

  const openModal = (index) => {
    setIsModalOpen(true);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex + 1 === item.images.length ? 0 : prevIndex + 1
    );
  };

  const showPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex - 1 < 0 ? item.images.length - 1 : prevIndex - 1
    );
  };

  const handleReviewSubmit = useCallback(() => {
    if (!rating || !comment) {
      toast.error("Rating and comment are required");
      return;
    }
    axios.defaults.withCredentials = true;
    axios
      .put(`${process.env.REACT_APP_HOST_URL}/product/review`, {
        productId: itemId,
        rating,
        comment,
      })
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setRating(0);
          setComment("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        if (!userID) {
          toast.error("Please Log-In to add Review.");
        } else {
          toast.error("Error submitting review");
        }
        console.error("Error submitting review:", err);
      });
  }, [rating, comment, itemId, userID]);

  const removeReview = useCallback(
    async (reviewID) => {
      axios.defaults.withCredentials = true;
      await axios
        .delete(
          `${process.env.REACT_APP_HOST_URL}/product/removeProductReview`,
          {
            data: { productId: itemId, reviewId: reviewID },
          }
        )
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.msg);
            setItem((prevItem) => ({
              ...prevItem,
              reviews: prevItem.reviews.filter(
                (review) => review._id !== reviewID
              ),
            }));
          } else {
            toast.error(response.data.msg);
          }
        })
        .catch((err) => {
          toast.error("Error in deleting review");
          console.error("Error in deleting review:", err);
        });
    },
    [itemId]
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/product/singleProduct/${itemId}`)
      .then((response) => {
        setItem(response.data.item);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
      });
  }, [itemId, handleReviewSubmit, removeReview]);

  return (
    <div className="bg-gray-100 p-5">
      <ToastContainer />
      <div className="flex justify-between">
        <button
          onClick={() => {
            const previousPath = location.state?.from || "/home";
            navigate(previousPath);
          }}
        >
          <IoIosArrowRoundBack size={24} />
        </button>

        <button
          onClick={() => {
            if (!userID)
              return toast.info("You Need To Log in First", {
                pauseOnFocusLoss: false,
              });
            navigate("/cart");
          }}
        >
          {dataFromLocation ? (
            <FiShoppingCart
              className={`mr-1 sm:w-[40px] bg-white rounded-e-2xl ${
                !userID ? "cursor-not-allowed" : ""
              }`}
              size={24}
            />
          ) : null}

          {/* <FiShoppingCart size={24} className="text-gray-500" />
          {cartNumber > 0 && (
            <span className=" top-10 right-10 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartNumber}
            </span>
          )} */}
        </button>
      </div>
      <div className="max-w-4xl mx-auto my-10 bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full  md:w-48 sm:w-[100%]  "
            src={item.thumbnail}
            alt={item.title}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {item.category}
          </div>
          <h1 className="mt-1 text-lg leading-tight font-medium text-black mb-2">
            {item.title} {item.brand && item.brand}
          </h1>
          <i className="text-sm"> ("product id" : {item._id}) </i>
          <p className="mt-2 text-gray-500 first-letter:uppercase ">
            {item.description}
          </p>
          <div className="mt-4 mb-2">
            <span className="text-teal-600 text-xl font-semibold">
              ₹ {Math.ceil(item.price)}
            </span>
            {item.discountPercentage !== 0 && (
              <span className="text-sm text-gray-600">
                ({item.discountPercentage}% off)
              </span>
            )}
          </div>
          {/* <div className="mt-4">
            <span className="text-sm text-gray-600">
              Rating: {item.ratings} / 5
            </span>
          </div> */}
          {item.reviews && (
            <div className="flex items-center   gap-1 text-sm text-gray-700 ">
              {/* <span>Rating:</span> */}
              <CardRating>{item.ratings} </CardRating>
              <span className="text-gray-500 font-semibold">
                ({item.reviews?.length})
              </span>
            </div>
          )}

          {dataFromLocation ? (
            <div className="mt-4">
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  !userID ? "cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!userID)
                    return toast.info("You Need To Log in First", {
                      pauseOnFocusLoss: false,
                    });
                  const title = item.title;
                  addToCart(null, itemId, title, userID, null, null, toast);
                }}
                // disabled={!userID}
              >
                Add to Cart
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Images Div */}
      {item.images && item.images.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            More Images
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {item.images.map((image, index) => (
              <img
                key={index}
                className="object-cover rounded-lg cursor-pointer hover:opacity-75"
                src={image}
                alt={`Product Img ${index + 1}`}
                onClick={() => openModal(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <section className="bg-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">
            Reviews ({item.reviews?.length || 0})
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {item.reviews && item.reviews.length > 0 ? (
              item.reviews.map((review, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md ">
                  <p>
                    <strong>Rating:</strong> {review.rating}
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  <p>
                    <strong>By:</strong>{" "}
                    {review.name ? review.name : "Anonymous"}
                  </p>
                  {userID === review.userID && (
                    <div className="mt-2">
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded"
                        onClick={() => {
                          let reviewID = review._id;
                          console.log(review);
                          removeReview(reviewID);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <i className="">
                No reviews yet. Be the first to review this product.
              </i>
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Your Review</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rating"
            >
              Rating {rating}
            </label>
            <input
              id="rating"
              type="range"
              min={0}
              max={5}
              step={0.1}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="comment"
            >
              Comment
            </label>
            <textarea
              id="comment"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>
      </section>

      {/* Modal for fullscreen image view */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-75 z-50">
          <div className="relative max-w-4xl w-[80%] h-[80%] flex justify-center items-center">
            {/* Close Button */}
            <span
              className="absolute top-5 right-5 text-4xl text-white cursor-pointer z-50 hover:text-red-400"
              onClick={closeModal}
            >
              &times;
            </span>

            {/* Previous Arrow */}
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-4xl z-50 hover:text-green-400"
              style={{ paddingLeft: "15px", paddingRight: "15px" }}
              onClick={showPrevious}
            >
              &lt;
            </div>

            {/* Image Container */}
            <div className="flex justify-center items-center w-full h-full">
              <img
                className="max-w-[100%] max-h-[90%] rounded-lg object-contain"
                src={item.images[selectedImageIndex]}
                alt={`Product Img ${selectedImageIndex + 1}`}
              />
            </div>

            {/* Next Arrow */}
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-4xl z-50 hover:text-green-400"
              style={{ paddingLeft: "15px", paddingRight: "15px" }}
              onClick={showNext}
            >
              &gt;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDescription;
