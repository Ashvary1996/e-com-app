import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
} from "@chakra-ui/react";

const PaymentSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const payId = searchParams.get("reference");
  const [orderData, setOrderData] = useState(null);
  // console.log(orderData);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/order/getOrderByPayId/${payId}`
        );
        setOrderData(response.data.order);
      } catch (err) {
        console.error(err);
      }
    };
    getOrders();
  }, [payId]);

  return (
    <Box>
      <VStack py={8} spacing={6} justifyContent="center" alignItems="center">
        <Heading as="h1" size="lg" textTransform="uppercase">
          Order Successful
        </Heading>
        {orderData && (
          <>
            <Text>Order ID: {orderData.razorpayOrderId}</Text>
            <Text>
              Order Date: {new Date(orderData.createdAt).toLocaleDateString()}
            </Text>
            <Text>
              Shipping Address: {orderData.shippingInfo.address},{" "}
              {orderData.shippingInfo.city}, {orderData.shippingInfo.state} -{" "}
              {orderData.shippingInfo.pinCode}
            </Text>
            <Text>Phone No.: {orderData.shippingInfo.phoneNo}</Text>
            <Box overflowX="auto" w="80%">
              <Table variant="striped" colorScheme="gray" minWidth="600px">
                <Thead>
                  <Tr>
                    <Th>S.no</Th>
                    <Th></Th>
                    <Th>Item</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orderData.orderItems.map((item, index) => (
                    <Tr key={item._id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Image
                          src={item.image[0]}
                          alt={item.name}
                          w={20}
                          h={20}
                          objectFit="cover"
                        />
                      </Td>
                      <Td>{item.name}</Td>
                      <Td>₹ {item.price.toFixed(2)}</Td>
                      <Td>{item.quantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Text>Total Amount Paid: ₹ {orderData.totalPrice}</Text>
            <Text className="border p-4 rounded bg-slate-500 text-white font-medium">
              Order Status: {orderData.orderStatus}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
