import Sales from "../models/sales.js";
import Customer from "../models/customer.js";
import { sendEmail } from "../utils/emailService.js";

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const {
      name,
      birthMonth,
      birthDay,
      phone,
      email,
      purchasedProducts,
      purchaseAmount,
      branch,
      paymentMode,
      cashier,
      salesPoint,
    } = req.body;

    // Check if the customer exists
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      // Create a new customer if they don't exist
      customer = new Customer({ name, birthMonth, birthDay, phone, email });
      await customer.save();
    }

    // Create the sale record
    const sale = new Sales({
      customer: customer._id,
      purchasedProducts,
      purchaseAmount,
      branch,
      paymentMode,
      cashier,
      salesPoint,
    });

    await sale.save();

    // Send Thank You Email
    if (email) {
      sendEmail(
        email,
        "Thank You for Your Purchase!",
        `Dear ${name},\n\nThank you for shopping with us! You purchased the following: ${purchasedProducts}. Your total purchase was $${purchaseAmount}.\n\nRegards,\nMall Prod`
      );
    }

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recording sale", error: error.message });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
