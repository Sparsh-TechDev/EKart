import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { addToCart, deleteFromCart, getCart, updateQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, deleteFromCart);


export default router;