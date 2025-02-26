import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authorize } from "../middleware/validateJWT.js";

const customerRoutes = express.Router();

router.post("/", createCustomer); // Create a new customer
router.get("/", getAllCustomers); // Get all customers
router.get("/:id", getCustomerById); // Get a single customer
router.put("/:id", updateCustomer); // Update a customer
router.delete("/:id", authorize("superadmin", "admin") , deleteCustomer); // Delete a customer

export default customerRoutes;
