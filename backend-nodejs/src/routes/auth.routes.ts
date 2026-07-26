import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;