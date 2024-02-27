const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  userName: {
    type: String,
  },

  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  totalQuantity: { type: Number, default: 0 },
  totalUniqueProducts: { type: Number, default: 0 },
});

const CartModel = mongoose.model("Carts", Cart);
module.exports = CartModel;
