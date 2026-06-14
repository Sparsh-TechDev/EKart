import express from "express";

import { multipleUpload } from "../middlewares/multer.js";
import { addProduct, deleteProduct, generateProductDescription, getAllProduct, getRecommendedProducts, updateProduct } from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);
router.get("/getallproducts", getAllProduct);
router.get("/recommendations/:productId", getRecommendedProducts);
router.post("/generate-description", isAuthenticated, isAdmin, generateProductDescription);
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct);


export default router;
