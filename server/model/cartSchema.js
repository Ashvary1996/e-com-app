const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
  },

  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const CartModel = mongoose.model("Cart", Cart);
module.exports = CartModel;
