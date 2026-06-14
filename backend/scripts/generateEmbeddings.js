import mongoose from "mongoose";
import dotenv from "dotenv";

import { Product } from "../models/productModel.js";
import { generateEmbedding } from "../utils/gemini.js";

dotenv.config();

console.log(process.env.MONGO_URI);
await mongoose.connect(`${process.env.MONGO_URI}/Ekart-YT`);

console.log("✅ MongoDB Connected");

const generateEmbeddings = async () => {
  try {
    const products = await Product.find();

    console.log(`📦 Found ${products.length} products`);

    for (const product of products) {
      console.log(`🔄 Processing: ${product.productName}`);

      const embeddingText = `
${product.productName}
${product.brand}
${product.category}
${product.productDesc}
`;

      const embedding = await generateEmbedding(embeddingText);

      product.embedding = embedding;

      await product.save();

      console.log(`✅ Saved embedding for ${product.productName}`);
    }

    console.log("🎉 All embeddings generated successfully");

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

generateEmbeddings();
