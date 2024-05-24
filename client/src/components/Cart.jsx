import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function Cart() {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    uniqueItems: 0,
  });

  const [total, setTotal] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  // const userID = getUserID();

  const fetchCartItems = useCallback(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/user/cart/getCartItems`)
      .then((response) => {
        // console.log("data:", response.data);
        setData(response.data);
        calculateTotal(response.data.items);
        setTotalItemsCount(response.data.totalItems);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  const calculateTotal = (cartItems) => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += Math.ceil(item.price) * item.quantity;
    });
    setTotal(totalAmount);
  };

  const updateItems = async (productId, quantity) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_HOST_URL}/user/cart/updateCartItems`,
        {
          productId: productId,
          quantity: quantity,
        }
      );
    } catch (error) {
      console.error("Error updating cart items:", error);
    }
  };

  const updateItemsLocal = (productId, quantity) => {
    // console.log("updateItemsLocal", productId);
    const updatedItems = data.items.map((item) => {
      if (item.product_id === productId) {
        // console.log("selectedItem", item);
        return { ...item, quantity: quantity };
      }
      return item;
    });

    // setData({ ...data, items: updatedItems });
    setData((prevData) => ({ ...prevData, items: updatedItems }));
    calculateTotal(updatedItems);
    setTotalItemsCount(
      updatedItems.reduce((total, item) => total + item.quantity, 0)
    );
  };

  const inc = (elem) => {
    const productId = elem.product_id;
    const quantity = elem.quantity;
    // console.log(productId);
    // console.log(quantity);
    updateItemsLocal(productId, quantity + 1);
    updateItems(productId, quantity + 1);
  };

  const dec = (elem) => {
    const productId = elem.product_id;
    const quantity = elem.quantity;
    if (elem.quantity > 1) {
      updateItemsLocal(productId, quantity - 1);
      updateItems(productId, quantity - 1);
    }
  };
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const removeCartItem = async (elem) => {
    const productId = elem.product_id;

    // console.log("selectedElem: ", productId);
    axios.defaults.withCredentials = true;
    try {
       await axios.delete(
        `${process.env.REACT_APP_HOST_URL}/user/cart/removeCartItems`,
        {
          data: {
            productId: productId,
          },
        }
      );
      // console.log(response.data);

      const updatedItems = data.items.filter(
        (item) => item.product_id !== productId
      );
      setData((prevData) => ({ ...prevData, items: updatedItems }));
      calculateTotal(updatedItems);
      setTotalItemsCount(
        updatedItems.reduce((total, item) => total + item.quantity, 0)
      );
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <ToastContainer stacked closeOnClick />
      <div className="flex justify-between">
        <p onClick={() => navigate("/home")} className="cursor-pointer">
          <b>{"<--"}</b>
        </p>
        <h3 className="text-lg font-semibold text-gray-800">
          Your Cart has "{totalItemsCount}" items
        </h3>
      </div>
      <div className="flex w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-gray-900 my-4">Your Items</h1>
          {data.items.map((elem, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b-2 border-gray-200 p-4"
            >
              <div className="w-1/5">
                <Link to={`/item/${elem.product_id}`}>
                  <img
                    src={elem.thumbnail}
                    alt="product_img"
                    className="w-full h-auto object-cover"
                  />
                </Link>
              </div>
              <div className="w-2/5 pl-4">
                <h2
                  onClick={() => {
                    // console.log(elem);
                  }}
                  className="text-xl text-gray-700"
                >
                  {elem.title}
                </h2>
              </div>
              <p className="w-1/5 text-lg text-gray-600">
                ₹ {Math.ceil(elem.price * 83.01)}
              </p>
              <div className="w-1/5 flex items-center justify-between">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                  onClick={() => dec(elem)}
                >
                  -
                </button>
                <p>{elem.quantity}</p>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
                  onClick={() => inc(elem)}
                >
                  +
                </button>
              </div>
              <div className="w-1/5 text-right">
                <p className="text-lg text-gray-600">
                  ₹ {Math.ceil(elem.price) * elem.quantity}
                </p>
              </div>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={() => {
                  removeCartItem(elem);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white shadow-lg p-4 flex justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Total Amount: ₹ {total}
        </h1>
        {totalItemsCount > 0 ? (
          <Link
            to="/contactInfo"
            state={{ finalAmount: total }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out transform hover:scale-105"
          >
            Check Out
          </Link>
        ) : (
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out transform hover:scale-105 opacity-50 cursor-not-allowed"
            disabled={true}
          >
            Check Out
          </button>
        )}
      </div>
    </div>
  );
}

export default Cart;
