import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAnalytics,
} from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), getOrders);
router.get("/analytics", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), getAnalytics);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), getOrderById);
router.put("/:id/status", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), updateOrderStatus);

export default router;