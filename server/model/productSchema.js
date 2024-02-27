const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    required: true,
    type: String,
  },

  description: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
  },
  brand: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
  thumbnail: {
    type: String,
  },
  images: {
    type: [String],
  },
  addedDate: {
    default: Date.now,
    type: Date,
  },
});

const Product = mongoose.model("Products", ProductSchema);
module.exports = Product;
