import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getUserID } from "../config/authTokenUser";

function Cart() {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    uniqueItems: 0,
  });

  const [total, setTotal] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const userID = getUserID();

  const fetchCartItems = useCallback(() => {
    axios
      .post("/user/getCartItems", { userId: userID })
      .then((response) => {
        setData(response.data);
        calculateTotal(response.data.items);
        setTotalItemsCount(response.data.totalItems);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [userID]);  

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]); // Now `fetchCartItems` is stable and can be included as a dependency

  const calculateTotal = (cartItems) => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += Math.ceil(item.price * 83.01) * item.quantity;
    });
    setTotal(totalAmount);
  };

  const updateItems = async (productItemId, quantity) => {
    await axios
      .post("/user/updateCartItems", {
        userId: userID,
        productItemId: productItemId,
        quantity: quantity,
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };
  const updateItemsLocal = (productItemId, quantity) => {
    const updatedItems = data.items.map((item) => {
      if (item.cart_item_id === productItemId) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    setData({ ...data, items: updatedItems });
    calculateTotal(updatedItems);
    setTotalItemsCount(
      updatedItems.reduce((total, item) => total + item.quantity, 0)
    );
  };
  const inc = (elem) => {
    updateItemsLocal(elem.cart_item_id, elem.quantity + 1);
    updateItems(elem.cart_item_id, elem.quantity + 1);
    console.log("elem", elem.cart_item_id);
  };
  const dec = (elem) => {
    if (elem.quantity > 1) {
      updateItemsLocal(elem.cart_item_id, elem.quantity - 1);
      updateItems(elem.cart_item_id, elem.quantity - 1);
    }
    console.log("decr cart done");
  };
  const removeCartItem = async (elem) => {
    await axios
      .post("/user/removeCartItems", {
        userId: userID,
        productItemId: elem.cart_item_id,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
    const updatedItems = data.items.filter(
      (item) => item.cart_item_id !== elem.cart_item_id
    );
    setData({ ...data, items: updatedItems });
    calculateTotal(updatedItems);
    console.log(elem.cart_item_id);
    setTotalItemsCount(
      updatedItems.reduce((total, item) => total + item.quantity, 0)
    );
  };

  return (
    <div>
      <div>
        <h3>Your Cart have "{totalItemsCount}" items</h3>
      </div>
      <div>
        <h1>Your Items</h1>
        {data.items.map((elem, i) => {
          return (
            <div
              key={i}
              className="border-2 border-red-900 flex justify-around"
            >
              <div className="border-2 border-red-900 w-[30%]">
                <img src="" alt="product_img" />
              </div>
              <div className="border-2 border-red-900 w-[45%]">
                <h2>{elem.title}</h2>
              </div>
              <div className="border-2 border-red-900 w-[15%]">
                <p>₹ {Math.ceil(elem.price * 83.01)}</p>
              </div>
              <div className="border-2 border-red-900 w-[15%] flex justify-around cursor-pointer">
                <p className=" hover:bg-red-600 w-10" onClick={() => dec(elem)}>
                  {"-"}
                </p>
                <p>{elem.quantity}</p>
                <p
                  className=" hover:bg-green-600 w-10"
                  onClick={() => inc(elem)}
                >
                  {"+"}
                </p>
              </div>
              <div className="border-2 border-red-900 w-[15%]">
                <p>{`₹ ${Math.ceil(elem.price * 83.01) * elem.quantity}`}</p>
              </div>
              <div className="border-2 border-red-900 w-[15%] hover:bg-red-600">
                <button onClick={() => removeCartItem(elem)}> Remove</button>
              </div>
            </div>
          );
        })}
        <div>
          <h1>Total Amount : {total}</h1>
        </div>
      </div>
    </div>
  );
}

export default Cart;
