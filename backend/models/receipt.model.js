import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
});

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" }, 
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true 
  },
  date: { type: Date, default: Date.now ,index: true},
}, { timestamps: true });


const walletSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 0 }
});

receiptSchema.index(
  { description: "text", name: "text" }, 
  { default_language: "arabic" } 
);
const Category = mongoose.model("Category", categorySchema);
const Receipt = mongoose.model("Receipt", receiptSchema);
const Wallet = mongoose.model("Wallet", walletSchema);

export { Category, Receipt, Wallet };