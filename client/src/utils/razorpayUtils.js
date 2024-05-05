// export const loadScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => {
//       resolve(true);
//     };
//     script.onerror = () => {
//       resolve(false);
//     }; 
//     document.body.appendChild(script);
//   });
// };

// export const createOrder = async (allData) => {
//   const response = await fetch(
//     `${process.env.REACT_APP_HOST_URL}/payment/create-order`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(allData), // Pass amount to create order
//     }
//   );
//   const data = await response.json();
//   return data.orderId;
// };
