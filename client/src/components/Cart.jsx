import React, { useState } from "react";

function Cart() {
  const [cart, setCartItems] = useState([]);
  console.log(cart);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    axios
      .get("/user/cart")
      .then((response) => {
        setCartItems(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };

  return (
    <>
      <div>
        <h3>Your Cart have # items</h3>
      </div>
      <div>
        <h1>Your Items</h1>
        <div className="border-2 border-red-900 flex justify-around">
          <div className="border-2 border-red-900 w-[30%]">
            <img src="" alt="image" />
          </div>
          <div className="border-2 border-red-900 w-[45%]">
            <h2>Title</h2>
          </div>
          <div className="border-2 border-red-900 w-[15%]">
            <p>Price</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
