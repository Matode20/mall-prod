// Import dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/userRoute.js";
import connectDB from "./db/conn.js";
import scheduleReports from "./services/reportScheduler.js";
import { scheduleBirthdayMessages } from "./utils/birthdayServices.js";
import customerRoutes from "./routes/customerRoute.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

scheduleReports();
scheduleBirthdayMessages();

// Routes
app.use("/api/sales", router);
app.use("/api/reports", router);
app.use("/api/customers", customerRoutes);
app.get("/", (req, res) => {
  res.send("hello welcome to my personal api server");
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// // Test route
// app.get("/", (req, res) => {
//     res.send("Sales Record Management API");
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
