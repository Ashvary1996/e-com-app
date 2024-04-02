const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please Enter Your Product Title/Name "],
    unique: [true, "Tile already exists , Please Enter Different Title/Name"],
  },

  description: {
    type: String,
    required: [true, "Please Enter Your Product Description "],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Your Product Price "],
  },
  category: {
    type: String,
    required: [true, "Please Enter Your Product Category "],
  },
  brand: {
    type: String,
    required: [true, "Please Enter Your Brand Name "],
  },
  thumbnail: {
    type: String,
    // required: [true, "Please Enter Your Product Thumbnail "],
  },
  images: {
    type: [String],
  },
  stock: {
    type: String,
    required: [true, "Please Enter Your Product Stock "],
    maxLength: [
      4,
      "Stock cannot exceeds 4 characters/ 9999 limit for listing ",
    ],
    default: 1,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      name: {
        type: String,
        require: true,
      },
      rating: {
        type: Number,
        require: true,
        default: 0,
      },
      comment: {
        type: String,
        require: true,
      },
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Product = mongoose.model("Products", ProductSchema);
module.exports = Product;
