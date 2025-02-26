import cron from "node-cron";
import { sendEmail } from "./emailService.js";
import Customer from "../models/customer.js";

export const scheduleBirthdayMessages = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🎂 Running Birthday Message Job");

    const today = new Date();
    const birthMonth = today.getMonth() + 1; // JS months are 0-indexed, so add 1
    const birthDay = today.getDate();

    const customers = await Customer.find({
      birthMonth,
      birthDay,
    });

    customers.forEach((customer) => {
      if (customer.email)
        sendEmail(
          customer.email,
          "Happy Birthday!",
          `Dear ${customer.name},\n\nHappy Birthday! We appreciate you. Enjoy your day!\n\n- Mall Prod`
        );
    });

    console.log(`🎂 Birthday messages sent to ${customers.length} customers`);
  });

  console.log("🎂 Birthday message scheduler started...");
};
