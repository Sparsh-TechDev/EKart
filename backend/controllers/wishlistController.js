import { Wishlist } from "../models/wishlistModel.js";
import { Product } from "../models/productModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.id;

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Already in wishlist",
        });
      }

      wishlist.products.push(productId);

      await wishlist.save();
    }

    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.id;

    const wishlist = await Wishlist.findOne({
      userId,
    }).populate("products");

    return res.status(200).json({
      success: true,
      wishlist: wishlist || { products: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (
  req,
  res
) => {
  try {
    const userId = req.id;

    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products =
      wishlist.products.filter(
        (item) =>
          item.toString() !== productId
      );

    await wishlist.save();

    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};