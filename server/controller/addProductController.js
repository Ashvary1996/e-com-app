const axios = require("axios");
const Product = require("../model/productSchema");

const addProduct = async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    });

    const newProduct = await product.save();
    console.log("Product saved:", newProduct);
    res.json({ newProduct:newProduct });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch products", err: error });
  }
};

module.exports = addProduct;
