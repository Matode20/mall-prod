import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";
import { login, register } from "../controllers/authController.js";
import { authorize, validateJWT } from "../middleware/validateJWT.js";
import {
  getSalesReport,
  getTopPerformers,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", validateJWT, createSale); // Create a new sale
router.get("/", validateJWT, authorize(admin, superadmin), getSales); // Get all sales
router.get("/:id", validateJWT, getSaleById); // Get a single sale by ID
router.put("/:id", validateJWT, updateSale); // Update a sale
router.delete("/:id", validateJWT, authorize(superadmin), deleteSale); // Delete a sale
router.post("/register", register);
router.post("/login", login);
router.get(
  "/sales",
  validateJWT,
  authorize("admin", "superadmin"),
  getSalesReport
);
router.get(
  "/top-performers",
  validateJWT,
  authorize("admin", "superadmin"),
  getTopPerformers
);

export default router;
