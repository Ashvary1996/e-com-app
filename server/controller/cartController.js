const CartModel = require("../model/cartSchema");

const addToCart = async (req, res) => {
  const { userId, userName, productId } = req.body;
  console.log(productId);
  try {
    let userInCart = await CartModel.findOne({ userId: userId });
    if (!userInCart) {
      userInCart = new CartModel({
        userId: userId,
        userName: userName,
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

    const updatedCart = await userInCart.save();
    res.status(201).json({ updatedCart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCartItems = async (req, res) => {
  const { userId } = req.body;
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
      return {
        cart_item_id: item._id,
        product_id: item.productId._id,
        title: item.productId.title,
        description: item.productId.description,
        price: item.productId.price,
        rating: item.productId.rating,
        brand: item.productId.brand,
        category: item.productId.category,
        thumbnail: item.productId.thumbnail,
        images: item.productId.images,
        quantity: item.quantity,
      };
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
  const { userId, productItemId, quantity } = req.body;
  // ...........................................................................
  try {
    let userCart = await CartModel.findOne({ userId: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    } else {
      userCart.products.map((sp) => {
        if (productItemId == sp._id.toString()) {
          sp.quantity = quantity;
        }
      });

      userCart.totalQuantity = userCart.products.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      userCart.totalUniqueProducts = userCart.products.length;
      await userCart.save();
      res.send(userCart);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const delCartItem = async (req, res) => {
  const { userId, productItemId } = req.body;
  // ...........................................................................
  try {
    let userCart = await CartModel.findOne({ userId: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    } else {
      userCart.products = userCart.products.filter(
        (sp) => sp._id.toString() !== productItemId
      );
      userCart.totalQuantity = userCart.products.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      userCart.totalUniqueProducts = userCart.products.length;

      await userCart.save();
      res.send(userCart.products);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToCart, getCartItems, updateCart, delCartItem };
