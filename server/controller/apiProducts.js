const axios = require("axios");
const Product = require("../model/productSchema");

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

module.exports = apiProducts;
 