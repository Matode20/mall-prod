import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/", createSale); // Create a new sale
router.get("/", getSales); // Get all sales
router.get("/:id", getSaleById); // Get a single sale by ID
router.put("/:id", updateSale); // Update a sale
router.delete("/:id", deleteSale); // Delete a sale
router.post("/register", register);
router.post("/login", login);

export default router;
