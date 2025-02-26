import { sendEmail } from "../utils/emailService.js";
import Customer from "../models/Customer.js";

/**
 * @desc Send bulk email & SMS messages
 * @route POST /api/messaging/send
 */
export const sendBulkMessages = async (req, res) => {
  try {
    const { message, subject } = req.body;
    const customers = await Customer.find({});

    customers.forEach((customer) => {
      if (customer.email) sendEmail(customer.email, subject, message);
    });

    res.json({ message: "Bulk messages sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending bulk messages", error: error.message });
  }
};
