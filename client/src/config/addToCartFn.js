import axios from "axios";

const addToCart = (item_id, userID, user, fetchCartItems) => {
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

export default addToCart;
