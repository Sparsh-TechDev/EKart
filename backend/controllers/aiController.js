import { model } from "../utils/gemini.js";
import { Product } from "../models/productModel.js";

export const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    const prompt = `
You are an AI shopping assistant.

Available Categories:
${categories.join(", ")}

Available Brands:
${brands.join(", ")}

User Query:
${query}

Return ONLY valid JSON.

{
  "brand": null,
  "category": null,
  "minPrice": null,
  "maxPrice": null
}

Rules:
- Use only available brands.
- Use only available categories.
- Detect price ranges.
- If user says "between 10000 and 20000",
  return:
  minPrice=10000
  maxPrice=20000
- If user says "under 20000",
  return:
  minPrice=null
  maxPrice=20000
- Return JSON only.
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let filters = {
      brand: null,
      category: null,
      maxPrice: null,
    };

    try {
      filters = JSON.parse(text);

      // Normalize price values
      filters.minPrice =
        filters.minPrice !== null ? Number(filters.minPrice) : null;

      filters.maxPrice =
        filters.maxPrice !== null ? Number(filters.maxPrice) : null;
    } catch (error) {
      console.log("Gemini Parse Error:", text);
    }

    return res.status(200).json({
      success: true,
      filters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const aiShoppingAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    const products = await Product.find()
      .select(
        "productName category brand productPrice productDesc"
      )
      .limit(100);

    const catalog = products
      .map(
        (p) => `
Name: ${p.productName}
Category: ${p.category}
Brand: ${p.brand}
Price: ₹${p.productPrice}
Description: ${p.productDesc}
`
      )
      .join("\n");

    const prompt = `
You are an AI Shopping Assistant for an ecommerce website.

Available Products:

${catalog}

Customer Request:
${message}

Rules:
- Recommend ONLY products from the catalog.
- Never invent products.
- Explain why each recommendation fits.
- Use simple formatting.
- Maximum 3 recommendations.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};