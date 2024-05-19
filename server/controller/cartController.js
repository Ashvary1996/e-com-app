const CartModel = require("../model/cartSchema");

const addToCart = async (req, res) => {
  const { productId } = req.body;

  const userId = req.userId;
  console.log(productId);
  try {
    let userInCart = await CartModel.findOne({ userId: userId });

    if (!productId.toString()) {
      return res.json({ msg: "Product ID not Available" });
    }

    if (!userInCart) {
      userInCart = new CartModel({
        userId: userId,
        userName: req.user.firstName,
        products: [
          {
            productId: productId,
            quantity: 1,
          },
        ],
        totalQuantity: 1,
        totalUniqueProducts: 1,
      });
    } else {
      const existingProduct = userInCart.products.find(
        (product) => product.productId.toString() === productId.toString()
      );
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        userInCart.products.push({ productId: productId, quantity: 1 });
      }

      userInCart.totalQuantity = userInCart.products.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      userInCart.totalUniqueProducts = userInCart.products.length;
    }

    const updatedCart = await userInCart.save({ validate: false });
    res.status(201).json({ updatedCart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCartItems = async (req, res) => {
  const userId = req.userId;
  // ...........................................................................
  try {
    let userCart = await CartModel.findOne({ userId: userId }).populate(
      "products.productId"
    );
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // res.json({ userCart });
    const items = userCart.products.map((item) => {
      if (item.productId) {
        return {
          cart_item_id: item._id,
          product_id: item.productId._id,
          title: item.productId.title,
          description: item.productId.description,
          price: item.productId.price,
          category: item.productId.category,
          brand: item.productId.brand,
          thumbnail: item.productId.thumbnail,
          images: item.productId.images,
          stock: item.productId.stock,
          discount: item.productId.discountPercentage,
          reviews: item.productId.reviews,
          totalReviews: item.productId.numOfReviews,
          ratings: item.productId.rating,
          quantity: item.quantity,
        };
      }
    });

    res.json({
      user: userCart.userName,
      totalItems: userCart.totalQuantity,
      uniqueItems: userCart.totalUniqueProducts,
      items: items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  try {
    let userCart = await CartModel.findOne({ userId: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productToUpdateIndex = userCart.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );

    if (productToUpdateIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    userCart.products[productToUpdateIndex].quantity = quantity;

    userCart.totalQuantity = userCart.products.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    await userCart.save();

    res.send({ userCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const delCartItem = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;

  try {
    let userCart = await CartModel.findOne({ userId: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productToDeleteIndex = userCart.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );

    if (productToDeleteIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    userCart.products.splice(productToDeleteIndex, 1);

    userCart.totalQuantity = userCart.products.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    userCart.totalUniqueProducts = userCart.products.length;

    await userCart.save();

    res.send({ userCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const clearCart = async (req, res) => {
  const userId = req.userId;

  try {
    let userCart = await CartModel.findOne({ userId: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear all products from the cart
    userCart.products = [];

    // Reset totalQuantity and totalUniqueProducts
    userCart.totalQuantity = 0;
    userCart.totalUniqueProducts = 0;

    await userCart.save();

    res.send({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = { addToCart, getCartItems, updateCart, delCartItem,clearCart };
