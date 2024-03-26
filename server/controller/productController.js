const axios = require("axios");
const Product = require("../model/productSchema");

const addProduct = async (req, res) => {
  try {
    const { title, brand, category, price } = req.body;
    const existingProduct = await Product.find({
      title,
      brand,
      category,
      price,
    });
    if (existingProduct.length > 0) {
      res.send({ msg: "Same product already exists." });
    } else {
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
      res.json({ newProduct: newProduct });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch products", err: error });
  }
};
const apiProducts = async (req, res) => {
  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100"
    );
    const items = response.data.products;
    const allProduct = [];

    for (const elem of items) {
      const product = new Product({
        title: elem.title,
        description: elem.description,
        price: elem.price,
        discountPercentage: elem.discountPercentage,
        rating: elem.rating,
        brand: elem.brand,
        category: elem.category,
        thumbnail: elem.thumbnail,
        images: elem.images,
      });

      const savedProduct = await product.save();
      allProduct.push(savedProduct);
    }

    res.json({ status: "products fetched successfully", array: allProduct });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch products", err: error });
  }
};
const getAllProducts = async (req, res) => {
  let items = await Product.find({});
  res.json({ totalItems: items.length, items: items });
};
const getSingleProduct = async (req, res) => {
  let item = await Product.find({
    _id: req.body.itemId,
  });
  res.json({ item: item });
};
module.exports = { addProduct, apiProducts, getAllProducts, getSingleProduct };
