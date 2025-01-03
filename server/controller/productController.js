const axios = require("axios");
const Product = require("../model/productSchema");

const createProduct = async (req, res) => {
  try {
    const { title, brand, category, price } = req.body;

    const existingProduct = await Product.find({
      title,
      brand,
      category,
      price,
    });
    if (existingProduct.length > 0) {
      res.json({
        status: "failed",
        message:
          "Same product already exist's with same title,brand,category and price. Kindly use different One",
      });
    } else {
      const userId = req.userId;
      // req.body.user = req.user.id;
      const product = await Product.create({ createdBy: userId, ...req.body });
      const newProduct = await product.save();

      console.log("Product saved:", newProduct);
      res.status(201).json({ success: true, Product: newProduct });
    }
  } catch (error) {
    console.error("Failed to Create product:", error);
    res.status(500).json({ status: "Failed to Create product", err: error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let items = await Product.find({});
    res.json({ totalItems: items.length, items: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    let item = await Product.findOne({
      _id: req.params.itemId,
    });

    if (!item) {
      return res.json({ message: "Item not found" });
    }

    res.json({ item: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateProduct = async (req, res, next) => {
  try {
    let items = await Product.findById(req.params.id);
    if (!items) {
      return res.json({ status: "fail", message: "Product not Found" });
    }

    items = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true,
      useFindAndModify: false,
    });
    res.json({ success: true, updated_Product: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    let items = await Product.findById(req.params.id);
    if (!items) {
      return res.json({ message: "Product not found" });
    }

    await items.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      Deleted_Item_Detail: items,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

const apiProducts = async (req, res) => {
  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100"
    );
    const items = response.data.products;

    // const response = await axios.get("https://fakestoreapi.com/products");
    // const items = response.data ;

    const allProduct = [];

    for (const elem of items) {
      const product = new Product({
        title: elem.title,
        description: elem.description,
        category: elem.category,
        price: elem.price * 83.31,
        discountPercentage: elem.discountPercentage,
        thumbnail: elem.thumbnail,
        ratings: elem.rating,
        stock: elem.stock,
        brand: elem.brand,
        reviews: elem.reviews,
        numOfReviews: elem.reviews.length,
        images: elem.images,
      });

      const savedProduct = await product.save({ validateBeforeSave: false });
      allProduct.push(savedProduct);
    }

    res.json({
      status: "products added Successfully",
      numbers: allProduct.length,
      array: allProduct,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Failed to Add products", err: error.message });
  }
};
//add/update review
const productReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    if (!rating || !comment || !productId) {
      return res.status(400).json({
        success: false,
        message: "Rating, comment, and product ID are required",
      });
    }
    if (!req.userId || !req.user || !req.user.firstName) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = product.reviews.find(
      (r) => r.userID.toString() === req.userId.toString()
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;

      product.numOfReviews = product.reviews.length;

      const sumOfRatings = product.reviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      product.ratings = sumOfRatings / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        productId,
        details: product.reviews,
      });
    } else {
      const review = {
        userID: req.userId,
        name: req.user.firstName,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;

      const sumOfRatings = product.reviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      product.ratings = sumOfRatings / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        message: "Review added successfully",
        productId,
        details: product.reviews,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the review",
      error: error.message,
    });
  }
};

// get all reviews of a single product
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      productTitle: product.title,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      errMsg: error.message,
    });
  }
};
// remove a review from a  product
const removeProductReview = async (req, res) => {
  try {
    const productId = req.body.productId;
    const reviewId = req.body.reviewId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    const removedReview = product.reviews.find(
      (review) => review._id.toString() === reviewId
    );
    if (!removedReview) {
      return res.status(404).json({ success: false, msg: "Review not found" });
    }

    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    if (product.reviews.length > 0) {
      let sumOfRatings = 0;
      product.reviews.forEach((review) => {
        sumOfRatings += review.rating;
      });
      product.ratings = sumOfRatings / product.reviews.length;
    } else {
      product.ratings = 0;
    }
    product.numOfReviews = product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      msg: "Review removed successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      errMsg: error.message,
    });
  }
};
//

module.exports = {
  createProduct,
  apiProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  productReview,
  getProductReviews,
  removeProductReview,
};
