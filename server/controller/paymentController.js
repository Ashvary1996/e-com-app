const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../model/paymentSchema");
const CartModel = require("../model/cartSchema");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const handelPayment = async (req, res) => {
  const { amount, contactInfo, items, shippingInfo, totalItems } = req.body;

  var options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  const userId = req.userId;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("expectedSignature", expectedSignature);
  console.log("razorpay_signature", razorpay_signature);
  console.log("const userId = req.userId;", userId);

  // res.json({ status: "working" });
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    ////////////////////
    // const payment = await instance.payments.fetch(razorpay_payment_id);
    // const { amount, notes } = payment;
    // const { items } = notes;

    // await Payment.create({
    //   user: req.userId,
    //   userName: req.user.userName,
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   amount,
    //   items,
    //   // Add other payment details as needed
    // });
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
// const paymentVerification = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   console.log("expectedSignature", expectedSignature);
//   console.log("razorpay_signature", razorpay_signature);

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     try {
//       const payment = await instance.payments.fetch(razorpay_payment_id);
//       const { amount, notes } = payment;
//       const { items } = notes;

//       await Payment.create({
//         razorpay_order_id,
//         razorpay_payment_id,
//         amount,
//         items,
//         // Add other payment details as needed
//       });

//       // Convert items to a string to be passed in the URL
//       const itemsString = items.join(",");

//       res.redirect(
//         `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}&items=${encodeURIComponent(itemsString)}`
//       );
//     } catch (error) {
//       console.error("Error fetching payment details from Razorpay:", error);
//       res.status(500).json({ success: false, error: "Error fetching payment details" });
//     }
//   } else {
//     res.status(400).json({ success: false, error: "Invalid signature" });
//   }
// };

module.exports = { handelPayment, paymentVerification };
