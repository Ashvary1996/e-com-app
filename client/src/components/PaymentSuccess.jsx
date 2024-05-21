import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  // console.log(location);
  const searchParams = new URLSearchParams(location.search);
  const payId = searchParams.get("reference"); 

  const getOrders = async () => {
    await axios
      .get(`http://localhost:5000/order/getOrderByPayId/${payId}`)
      .then((data) => console.log(data.data ))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOrders();
  }, [searchParams]);

  return (
    <Box>
      <VStack h="100vh" justifyContent={"center"} alignItems="center">
        <Heading textTransform={"uppercase"}> Order Successful</Heading>

        <Text>Reference No.: {payId}</Text>

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
