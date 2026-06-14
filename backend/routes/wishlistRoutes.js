import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  addToWishlist
);

router.get(
  "/my-wishlist",
  isAuthenticated,
  getWishlist
);

router.delete(
  "/remove/:productId",
  isAuthenticated,
  removeFromWishlist
);

export default router;