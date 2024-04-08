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
  axios
    .post("http://localhost:5000/user/cart/addTocart", {
      userId: userID,
      productId: itemId,
    }) 
    .then((response) => {
      console.log(response.data);
      fetchCartItems(); 
      toast.info(`${title} : Added to Cart `); 
    })
    .catch((err) => console.log(err)); 
};

export default addToCart;
