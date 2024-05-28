import axios from "axios";
 
const addToCart = async (
  elem,
  itemId,
  title,
  userID,
  user,
  fetchCartItems,
  toast
) => {

  axios.defaults.withCredentials = true;

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_URL}/user/cart/addToCart`,
      {
        userId: userID,
        productId: itemId,
      }
    );
    console.log(response.data);
    if(fetchCartItems) {fetchCartItems()};
    toast.info(`${title} : Added to Cart`);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export default addToCart;
