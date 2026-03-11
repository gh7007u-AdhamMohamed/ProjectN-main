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
  purchased: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  date: { type: Date, required: true ,index: true},
}, { timestamps: true });


const walletSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 0 }

});
const historySchema = new mongoose.Schema({
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const History = mongoose.model("History", historySchema);
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

receiptSchema.index(
  { description: "text", name: "text" }, 
  { default_language: "arabic" } 
);

const Category = mongoose.model("Category", categorySchema);
const Receipt = mongoose.model("Receipt", receiptSchema);
const Wallet = mongoose.model("Wallet", walletSchema);

export { Category, Receipt, Wallet, Counter, History };
