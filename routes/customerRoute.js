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

customerRoutes.post("/create-customer", createCustomer); // Create a new customer
customerRoutes.get("/", getAllCustomers); // Get all customers
customerRoutes.get("/:id", getCustomerById); // Get a single customer
customerRoutes.put("/:id", updateCustomer); // Update a customer
customerRoutes.delete("/:id", authorize("superadmin", "admin"), deleteCustomer); // Delete a customer

export default customerRoutes;
