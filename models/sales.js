import mongoose from "mongoose";

const Sales = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerDOB: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
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

export default Sales;
