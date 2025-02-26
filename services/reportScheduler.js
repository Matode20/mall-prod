import cron from "node-cron";
import Sales from "../models/sales.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Email service configuration
const emailServices = {
  gmail: {
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  },
  yahoo: {
    service: "yahoo",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  },
  // Add other email services as needed
};

/**
 * Generates a sales report for a given date range
 * @param {Date} startDate - Start date for the report
 * @param {Date} endDate - End date for the report
 * @returns {Object} Report containing totalSales, totalTransactions, and topProducts
 */
const generateReport = async (startDate, endDate) => {
  // Aggregate sales data using MongoDB pipeline
  const sales = await Sales.aggregate([
    // Match sales within date range
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    // Deconstruct items array to process each item separately
    { $unwind: "$items" },
    // Group all matching documents and calculate totals
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        totalTransactions: { $sum: 1 },
        topProducts: {
          $push: {
            product: "$items.productId",
            quantity: "$items.quantity",
            revenue: "$items.totalPrice",
          },
        },
      },
    },
  ]);

  // Return sales data or default values if no sales found
  return sales[0] || { totalSales: 0, totalTransactions: 0, topProducts: [] };
};

/**
 * Sends email report using nodemailer
 * @param {Object} report - The generated sales report
 * @param {String} type - Report type (Weekly/Monthly)
 */
const sendEmail = async (report, type) => {
  // Select email service configuration based on environment variable
  const emailService = emailServices[process.env.EMAIL_SERVICE];

  if (!emailService) {
    throw new Error(`Unsupported email service: ${process.env.EMAIL_SERVICE}`);
  }

  // Configure email transport using the selected service
  const transporter = nodemailer.createTransport(emailService);

  // Send email with formatted report
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.REPORT_RECIPIENTS,
    subject: `${type} Sales Report`,
    html: `
      <h3>${type} Sales Report</h3>
      <p>Total Sales: $${report.totalSales}</p>
      <p>Total Transactions: ${report.totalTransactions}</p>
      <h4>Top Products:</h4>
      <ul>${report.topProducts
        .slice(0, 5)
        .map((p) => `<li>${p.product}: ${p.quantity} sold, $${p.revenue}</li>`)
        .join("")}</ul>
    `,
  });
};

/**
 * Sets up scheduled report generation and email distribution
 * Configures both weekly and monthly reports
 */
const scheduleReports = () => {
  // Define schedule configurations
  const schedules = [
    { cron: "0 7 * * 1", type: "Weekly", days: 7 }, // Weekly on Monday 7AM
    { cron: "0 8 1 * *", type: "Monthly", days: 30 }, // Monthly on 1st 8AM
  ];

  // Set up each scheduled report
  schedules.forEach(({ cron: schedule, type, days }) => {
    cron.schedule(schedule, async () => {
      // Calculate start date based on report type
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      // Generate and send report
      const report = await generateReport(startDate, new Date());
      await sendEmail(report, type);
    });
  });
};

export default scheduleReports;
