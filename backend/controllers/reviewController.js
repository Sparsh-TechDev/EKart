import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";
import { model } from "../utils/gemini.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const hasPurchased = await Order.findOne({
      user: userId,
      "products.productId": productId,
      status: "Paid",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message:
          "Only customers who purchased this product can review it",
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate(
        "user",
        "firstName lastName profilePhoto"
      )
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / totalReviews
          ).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    });

    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        summary:
          "No reviews available yet for AI analysis.",
      });
    }

    const reviewText = reviews
      .map(
        (review) =>
          `
Rating: ${review.rating}/5

Comment:
${review.comment}
`
      )
      .join("\n");

    const prompt = `
Analyze these ecommerce product reviews.

Reviews:

${reviewText}

Return ONLY:

Customers Love:
- point
- point

Common Complaints:
- point
- point

Keep response under 120 words.
`;

    const result =
      await model.generateContent(prompt);

    const summary =
      result.response.text();

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};