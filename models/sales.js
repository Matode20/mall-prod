import mongoose from "mongoose";
import Customer from "./customer.js";

const SaleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    products: [{ name: String, quantity: Number, price: Number }],
    purchaseTime: { type: Date, default: Date.now },
    purchaseAmount: { type: Number, required: true },
    branch: { type: String, required: true },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true,
    },
    cashierName: { type: String, required: true },
    cashierSalesPoint: { type: String, required: true },
  },
  { timestamps: true }
);
const Sales = mongoose.model("Sales", SaleSchema);
export default Sales;
