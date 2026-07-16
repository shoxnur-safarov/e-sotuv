import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), createProduct);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteProduct);

export default router;