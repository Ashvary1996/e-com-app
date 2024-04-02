const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

const newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = new Order({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      userId: req.userId,
    });

    await order.save();

    res.status(201).json({
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
const getmyOrder = async (req, res) => {
  try {
    const order = await Order.find({ userId: req.userId });

    if (!order) {
      return res.json({ msg: "order not Found" });
    }

    res.status(200).json({
      success: true,
      userName: req.user.firstName,
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
    const order = await Order.findById({ _id: req.params.orderId });
    let updateStatus = req.body.orderStatus;
    if (!order) return res.send("Order not found with this Id");

    if (order.orderStatus === "Delivered")
      return res.send("You have already delivered this order");

    // if (req.body.status === "Shipped") {
    //   order.orderItems.forEach(
    //     async (order) => await updateStock(order.productId, order.quantity)
    //   );
    // }
    order.orderStatus = updateStatus;

    if (req.body.status === "Delivered") order.deliveredAt = Date.now();

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
};
