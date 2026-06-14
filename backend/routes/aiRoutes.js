import express from "express";
import { aiSearch, aiShoppingAssistant } from "../controllers/aiController.js";

const router = express.Router();

router.post("/search", aiSearch);
router.post("/assistant", aiShoppingAssistant);

export default router;