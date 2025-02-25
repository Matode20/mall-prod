import Sales from "../models/sales.js";
import mongoose from "mongoose";

/**
 * Get sales report with filters
 * @route GET /api/reports/sales
 */
export const getSalesReport = async (req, res) => {
    try {
        // Destructure query parameters
        const { startDate, endDate, product, customer, cashier, branch } = req.query;

        // Build filter object dynamically
        const filter = {
            ...(startDate && endDate && {
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }),
            ...(product && { "items.productId": mongoose.Types.ObjectId(product) }),
            ...(customer && { customerId: mongoose.Types.ObjectId(customer) }),
            ...(cashier && { cashierId: mongoose.Types.ObjectId(cashier) }),
            ...(branch && { branch })
        };

        const sales = await Sales.find(filter).populate("customerId cashierId items.productId");
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error generating report", error });
    }
};

/**
 * Get top performers (Customers, Products, Cashiers, Branches)
 * @route GET /api/reports/top-performers
 */
export const getTopPerformers = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        // Define group configurations for different types
        const groupConfigs = {
            customer: { _id: "$customerId", totalSpent: { $sum: "$totalAmount" }, count: { $sum: 1 } },
            product: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.totalPrice" } },
            cashier: { _id: "$cashierId", totalSales: { $sum: "$totalAmount" }, transactions: { $sum: 1 } },
            branch: { _id: "$branch", totalRevenue: { $sum: "$totalAmount" }, transactions: { $sum: 1 } }
        };

        // Validate type parameter
        if (!groupConfigs[type]) {
            return res.status(400).json({
                message: "Invalid type. Choose customer, product, cashier, or branch"
            });
        }

        // Build aggregation pipeline
        const pipeline = [
            ...(startDate && endDate ? [{ $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } }] : []),
            { $unwind: "$items" },
            { $group: groupConfigs[type] },
            { $sort: { totalRevenue: -1, totalSpent: -1, totalSold: -1, transactions: -1 } },
            { $limit: 10 }
        ];

        const topPerformers = await Sales.aggregate(pipeline);
        res.status(200).json(topPerformers);
    } catch (error) {
        res.status(500).json({ message: "Error generating report", error });
    }
};
