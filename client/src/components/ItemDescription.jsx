import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import addToCart from "../config/addToCartFn";
import { getUserID } from "../config/authTokenUser";

function ItemDescription() {
  const { itemId } = useParams();
  const [item, setItem] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const userID = getUserID();
  const navigate = useNavigate();

  console.log(userID);

  useEffect(() => {
    axios
      .post(`/user/singleProduct/`, { itemId: itemId })
      .then((response) => {
        setItem(response.data.item[0]);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
      });
  }, [itemId]);

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

  return (
    <div className="bg-gray-100 p-5">
      <div className="flex justify-between ">
        <button onClick={() => navigate("/home")}>Back to Home</button>
        <button onClick={() => navigate("/cart")}>goToCart</button>
      </div>
      <div className="max-w-4xl mx-auto my-10 bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={item.thumbnail}
            alt={item.title}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {item.category}
          </div>
          <h1>
            {item.title} ({item.brand}){" "}
          </h1>
          <p className="mt-2 text-gray-500">{item.description}</p>
          <div className="mt-4">
            <span className="text-teal-600 text-md font-semibold">
              $ {item.price}
            </span>
            <span className="text-sm text-gray-600">
              ({item.discountPercentage}% off)
            </span>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              Rating: {item.rating} / 5
            </span>
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                addToCart(itemId, userID);
                alert("ItemAddedToCart");
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* Images Div */}
      <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          More Images
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(item.images || []).map((image, index) => (
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

            {/* Previous Arrow update this with icon in future*/}
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-4xl z-50 hover:text-green-400 "
              style={{ paddingLeft: "15px", paddingRight: "15px" }} // Padding for easier click
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
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-4xl z-50 hover:text-green-400 "
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
