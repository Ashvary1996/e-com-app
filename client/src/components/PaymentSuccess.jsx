import React   from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
// import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const referenceNum = searchParams.get("reference");
  // const itemsString = searchParams.get("items");
  // const items = itemsString ? itemsString.split(",") : [];

  // useEffect(() => {
  //   const clearCart = async () => {
  //     try {
  //       const response = await axios.delete(
  //         `${process.env.REACT_APP_HOST_URL}/user/cart/clearCartItems`
  //       );
  //       console.log("Cart Cleared Successfully");
       
  //     } catch (error) {
  //       console.error("Error clearing cart:", error);
  //     }
  //   };

  //   clearCart();
  // }, []);

  return ( 
    <Box>
      <VStack h="100vh" justifyContent={"center"} alignItems="center">
        <Heading textTransform={"uppercase"}> Order Successful</Heading>

        <Text>Reference No.: {referenceNum}</Text>

        {/* <Text>Items:</Text> 
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul> */}
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
