import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { model } from "../utils/gemini.js";
import { Order } from "../models/orderModel.js";
import { Wishlist } from "../models/wishlistModel.js";
import { Cart } from "../models/cartModel.js";
import { Review } from "../models/reviewModel.js";
import natural from "natural";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // handle multiple image upload
    let productImg = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // create product
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });
    

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(400).json({
        success: false,
        message: "No product available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateProductDescription = async (req, res) => {
  try {
    const { productName, brand, category } = req.body;

    const prompt = `
You are an expert e-commerce copywriter.

Product Name: ${productName}
Brand: ${brand}
Category: ${category}

Generate content in the following format:

PRODUCT OVERVIEW

Write a professional overview of the product.

KEY FEATURES

List 5 important features.

BENEFITS

Explain how the product helps the customer.

MARKETING TAGLINE

Create a short premium tagline.

IMPORTANT:
- Do NOT use markdown.
- Do NOT use *, **, #, ##, bullet symbols.
- Use plain text only.
- Make it look professional.
- Length between 200 and 250 words.
`;

    const result = await model.generateContent(prompt);

    let description = result.response.text();

    description = description
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .trim();

    return res.status(200).json({
      success: true,
      description,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const products = await Product.find({
      _id: { $ne: productId },
    });

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
      });
    }

    const tfidf = new natural.TfIdf();

    // Helper to build the text string. 
    // We intentionally repeat category and brand to give them higher weight in the TF-IDF calculation.
    const buildDoc = (product) => {
      return `${product.category} ${product.category} ${product.brand} ${product.brand} ${product.productName} ${product.productDesc}`;
    };

    // Add target product at index 0
    tfidf.addDocument(buildDoc(currentProduct));
    
    // Add all other products
    products.forEach((product) => tfidf.addDocument(buildDoc(product)));

    // 1. Create a vector and calculate magnitude for the Target Product (Index 0)
    const targetTerms = tfidf.listTerms(0);
    const targetVector = {};
    let targetMagnitude = 0;

    targetTerms.forEach((t) => {
      targetVector[t.term] = t.tfidf;
      targetMagnitude += t.tfidf * t.tfidf;
    });
    targetMagnitude = Math.sqrt(targetMagnitude);

    // 2. Compare against all other products using Cosine Similarity
    const recommendations = products.map((product, index) => {
      const docIndex = index + 1; // offset by 1 because target is at 0
      const terms = tfidf.listTerms(docIndex);

      let dotProduct = 0;
      let docMagnitude = 0;

      terms.forEach((t) => {
        // If the term exists in our target product, calculate the dot product
        if (targetVector[t.term]) {
          dotProduct += t.tfidf * targetVector[t.term];
        }
        // Calculate the magnitude of the current document
        docMagnitude += t.tfidf * t.tfidf;
      });

      docMagnitude = Math.sqrt(docMagnitude);

      // 3. Final Cosine Similarity calculation
      let similarity = 0;
      if (targetMagnitude > 0 && docMagnitude > 0) {
        similarity = dotProduct / (targetMagnitude * docMagnitude);
      }

      return {
        ...product.toObject(),
        similarity,
      };
    });

    // Sort by highest similarity and take the top 4
    const sortedProducts = recommendations
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      recommendations: sortedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    // delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // delete product from mongodb
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    // keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // remove deleted images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      // keep all old images if nothing removed
      updatedImages = product.productImg;
    }

    // upload new images
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // update product fields
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
