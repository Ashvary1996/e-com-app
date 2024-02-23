const Product = require("../model/productSchema");
let allProductFn = async (req, res ) => {
  let items = await Product.find({});
  res.json({ totalItems: items.length, items: items });
  
};

module.exports = allProductFn;
