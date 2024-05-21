const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: [{ type: String, required: true }],
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
    },
  ],
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  razorpayOrderId: { type: String, required: true },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date, required: true },
  itemsPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  orderStatus: { type: String, required: true, default: "Processing" },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
