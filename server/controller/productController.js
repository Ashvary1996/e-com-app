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
      _id: req.body.itemId,
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
      runValidators: true,
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

    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
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
    const allProduct = [];

    for (const elem of items) {
      const product = new Product({
        title: elem.title,
        description: elem.description,
        category: elem.category,
        brand: elem.brand,
        thumbnail: elem.thumbnail,
        price: elem.price,
        discountPercentage: elem.discountPercentage,
        // rating: elem.reviews.rating,
        images: elem.images,
      });

      const savedProduct = await product.save();
      allProduct.push(savedProduct);
    }

    res.json({ status: "products added Successfully", array: allProduct });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to Add products", err: error });
  }
};

module.exports = {
  createProduct,
  apiProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
