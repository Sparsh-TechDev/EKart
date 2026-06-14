import express from "express";
import { allUser, changePassword, forgotPassword, getUserById, login, logout, makeAdmin, register, removeAdmin, reVerify, updateUser, verify, verifyOtp } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOtp);
router.post("/change-password/:email", changePassword);
router.get("/all-user", isAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", getUserById);
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);
router.put("/make-admin/:userId", isAuthenticated, makeAdmin);
router.put("/remove-admin/:userId", isAuthenticated, removeAdmin);

export default router;