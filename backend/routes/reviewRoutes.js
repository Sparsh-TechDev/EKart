import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { addReview, deleteReview, getProductReviews, getReviewSummary, updateReview } from "../controllers/reviewController.js";



const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  addReview
);

router.get(
  "/:productId",
  getProductReviews
);

router.put(
  "/:reviewId",
  isAuthenticated,
  updateReview
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  deleteReview
);

router.get(
  "/summary/:productId",
  getReviewSummary
);

export default router;