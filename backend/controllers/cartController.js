import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({
        success: true,
        cart: [],
      });
    }
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;

    const { productId, quantity } = req.body;

    const qty = Math.max(1, Number(quantity) || 1);

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: qty,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice * qty,
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Increase existing quantity
        cart.items[itemIndex].quantity += qty;
      } else {
        // Add new product
        cart.items.push({
          productId,
          quantity: qty,
          price: product.productPrice,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;

    const { productId, type } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const deleteFromCart = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { productId } = req.body;

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     const item = cart.items.filter(
//       (item) => item.productId.toString() !== productId,
//     );

//     cart.totalPrice = cart.items.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0,
//     );

//     await cart.save();
//     return res.status(200).json({
//       success: true,
//       cart,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // FIX 1: Assign the filtered array BACK to cart.items
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    // Now this correctly calculates based on the remaining items
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    // FIX 2: Populate the product details before sending to the frontend
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};