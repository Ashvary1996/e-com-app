const CartModel = require("../model/cartSchema");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");
const axios = require("axios");

const newOrder = async (req, res) => {
  try {
    const { contactInfo, shippingInfo, items, totalItems, totalPayableAmount } =
      req.body;
    // Create new order in Razorpay and get the order ID
    const razorpayOrder = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount: totalPayableAmount * 100, // Convert to paise
        currency: "INR",
        payment_capture: 1,
      },
      {
        auth: {
          username: process.env.KEY_ID,
          password: process.env.KEY_SECRET,
        },
      }
    );

    const razorpayOrderId = razorpayOrder.data.id;

    // Create new order
    const order = new Order({
      totalItems: totalItems,
      shippingInfo: {
        phoneNo: contactInfo.phoneNo,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pinCode: shippingInfo.pinCode,
      },
      orderItems: items.map((item, i) => ({
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images,
        productId: item.product_id,
      })),

      userId: req.user,

      razorpayOrderId,

      paymentInfo: {
        id: null,
        status: "Pending",
      },
      paidAt: null,
      itemsPrice: totalPayableAmount,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: totalPayableAmount,
      orderStatus: "Processing", // Initial status
    }); 

    const saveOrder = new Order(order);
    await saveOrder.save({ validateBeforeSave: false });

    // Return the Razorpay order ID
    res.status(201).json({ order: { id: razorpayOrderId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order", err: error });
  }
};
const handleRazorpayCallback = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, amount } = req.body;

    // Find the order using the Razorpay order ID
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }

    // Update order details
    order.paymentInfo = {
      id: razorpay_payment_id,
      status: "Paid",
    };
    order.paidAt = new Date();
    order.orderStatus = "Proceed to Shipping";
    // paid, shipped,delivered

    ////////////////////////////
    // removing cart after payment success //
    const userId = order.userId;
    let userCart = await CartModel.findOneAndDelete({ userId: userId });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      razorpay_payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
//for admin
const getUserOrders = async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });

    if (!order) {
      return res.json({ msg: "order not Found" });
    }

    res.status(200).json({
      success: true,

      total_orders: order.length,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find({});

    if (!order) {
      return res.json({ msg: "order not Found" });
    }

    res.status(200).json({
      success: true,

      total_orders: order.length,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getOrderByPayId = async (req, res) => {
  try {
    const payId = req.params.payId;
    const order = await Order.findOne({ "paymentInfo.id": payId });

    if (!order) {
      return res.json({ msg: "order not Found" });
    }

    // use NodeMailer to send Order Detail To Customer here

    res.status(200).json({
      success: true,
      payId: payId,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getmyOrder = async (req, res) => {
  try {
    const myOrders = await Order.find({ userId: req.userId });

    if (!myOrders || myOrders.length === 0) {
      return res.status(404).json({ msg: "No orders found" });
    }

    const paidOrders = myOrders.filter(
      (order) => order.paymentInfo.status === "Paid"
    );

    return res.status(200).json({
      success: true,
      userName: req.user.firstName,
      total_orders: paidOrders.length,
      orders: paidOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//for admin
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.orderId });

    if (!order) {
      return res.status(404).json({ msg: "Order-ID not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ razorpayOrderId: req.params.orderId });
    let updateStatus = req.body.orderStatus;

    if (!order) return res.send("Order not found with this Id");

    if (order.orderStatus === "Delivered")
      return res.send("You have already delivered this order");

    if (req.body.orderStatus === "Shipped") {
      order.orderItems.forEach(
        async (orderItem) =>
          await updateStock(orderItem.productId, orderItem.quantity)
      );
    }

    order.orderStatus = updateStatus;

    if (req.body.orderStatus === "Delivered") order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//delete Order admin
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ msg: "Order not found with this Id" });
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    msg: "Order Deleted",
  });
};

module.exports = {
  getUserOrders,
  newOrder,
  getAllOrders,
  getmyOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  handleRazorpayCallback,
  getOrderByPayId,
};
