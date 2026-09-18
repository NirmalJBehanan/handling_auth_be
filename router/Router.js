import express from "express"
import { forgetpassword, login, profile, register, resetpassword, verifyTokens } from "../controller/Controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/register",register)
router.post("/login",login)
router.post("/forgetpassword",forgetpassword)
router.get("/verifytoken",authMiddleware,verifyTokens)
router.put("/resetpassword",authMiddleware,resetpassword)
router.get("/profile",authMiddleware,profile)

export default router;