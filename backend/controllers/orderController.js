import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { Wishlist } from "../models/wishlistModel.js";

export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;
    const options = {
      amount: Math.round(Number(amount) * 100), // converting to Paisa
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    //  saveOrderInDb
    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.log("❌ Error in create order: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    const userId = req.user._id;

    // 1. Handle Failed Payments
    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" }, // See note below about this warning
      );
      return res.status(400).json({
        success: false,
        message: "Payment Failed:",
        order,
      });
    } // ✅ CLOSE THE IF BLOCK HERE!

    // 2. Handle Successful Payments
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { returnDocument: "after" },
      );
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
      );
      return res.status(200).json({
        success: true,
        message: "Payment Successful",
        order,
      });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" },
      );
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }
  } catch (error) {
    console.error("❌ Error in verifying payment: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admins Only
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // User id will come from URL

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      }) // fetch product details
      .populate("user", "firstName lastName email"); // fetch user info

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.productId", "productName productPrice");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

export const getSalesData = async (req, res) => {
  try {
    // Basic Stats
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({
      status: "Paid",
    });

    // Total Revenue
    const totalSaleAggregate = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalSales = totalSaleAggregate[0]?.total || 0;

    // Average Order Value
    const averageOrderValue =
      totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    // Last 30 Days Sales
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      {
        $match: {
          status: "Paid",
          createdAt: {
            $gte: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));

    // Revenue Forecast
    let forecastRevenue = 0;

    if (formattedSales.length >= 2) {
      const revenues = formattedSales.map((sale) => sale.amount);

      let growthSum = 0;

      for (let i = 1; i < revenues.length; i++) {
        growthSum += revenues[i] - revenues[i - 1];
      }

      const averageGrowth = growthSum / (revenues.length - 1);

      forecastRevenue = Math.max(
        0,
        revenues[revenues.length - 1] + averageGrowth,
      );
    } else if (formattedSales.length === 1) {
      forecastRevenue = formattedSales[0].amount;
    }

    // Top Selling Products
    const topProductsRaw = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.productId",
          totalSold: {
            $sum: "$products.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ]);

    const topProducts = topProductsRaw.map((item) => ({
      name: item.product.productName,
      sold: item.totalSold,
    }));

    // Top Categories
    const topCategoriesRaw = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.category",
          totalSold: {
            $sum: "$products.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    const topCategories = topCategoriesRaw.map((item) => ({
      category: item._id,
      sold: item.totalSold,
    }));

    const insights = [];

    if (topCategories.length > 0) {
      insights.push(
        `${topCategories[0].category} is your best-selling category.`,
      );
    }

    if (topProducts.length > 0) {
      insights.push(`${topProducts[0].name} is your top-selling product.`);
    }

    insights.push(
      `Average order value is ₹${averageOrderValue.toLocaleString("en-IN")}.`,
    );

    insights.push(
      `Revenue forecast for the next day is ₹${Math.round(
        forecastRevenue,
      ).toLocaleString("en-IN")}.`,
    );

    // Demand Forecast Analysis

    const products = await Product.find();

    const demandForecast = [];

    for (const product of products) {
      // Purchase Count
      const purchaseData = await Order.aggregate([
        {
          $match: {
            status: "Paid",
          },
        },
        {
          $unwind: "$products",
        },
        {
          $match: {
            "products.productId": product._id,
          },
        },
        {
          $group: {
            _id: null,
            totalPurchases: {
              $sum: "$products.quantity",
            },
          },
        },
      ]);

      const purchases = purchaseData[0]?.totalPurchases || 0;

      // Wishlist Count
      const wishlistCount = await Wishlist.countDocuments({
        products: product._id,
      });

      // Cart Count
      const cartData = await Cart.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.productId": product._id,
          },
        },
        {
          $group: {
            _id: null,
            totalCartAdds: {
              $sum: "$items.quantity",
            },
          },
        },
      ]);

      const cartAdds = cartData[0]?.totalCartAdds || 0;

      // Demand Score
      const demandScore = purchases * 5 + cartAdds * 3 + wishlistCount * 2;

      let demandLevel = "Low";

      if (demandScore >= 20) {
        demandLevel = "High";
      } else if (demandScore >= 10) {
        demandLevel = "Medium";
      }

      demandForecast.push({
        productName: product.productName,
        score: demandScore,
        level: demandLevel,
      });
    }

    demandForecast.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,

      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,

      averageOrderValue,
      forecastRevenue,

      sales: formattedSales,

      topProducts,
      topCategories,

      insights,
      demandForecast: demandForecast.slice(0, 5),
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
