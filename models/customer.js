import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthMonth: { type: Number, required: true }, // Store birth month (1-12)
  birthDay: { type: Number, required: true }, // Store birth day (1-31)
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true }, // Store unique email
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;