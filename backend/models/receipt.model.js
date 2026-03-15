import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
});

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" }, 
  amount: { type: Number, required: true },
  
  purchased: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  date: { type: Date, required: true ,index: true},
}, { timestamps: true });


const walletSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 0 }

});
const historySchema = new mongoose.Schema({
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt",default:null },
  amount: { type: Number, required: true },
    type: {
    type: String,
    enum: ["purchase", "addMoney","reset"],
    required: true,
    default:"purchase"
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const History = mongoose.model("History", historySchema);
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});
const itemSchema =new mongoose.Schema({
    receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt",required: true },
    count:{type:Number,required:true,default:1},
    description:{type:String,required:true},
    price:{type:Number,required:true}

})
const Item=mongoose.model("Item",itemSchema);

const Counter = mongoose.model("Counter", counterSchema);

receiptSchema.index(
  { description: "text", name: "text" }, 
  { default_language: "arabic" } 
);
// receipt.model.js
itemSchema.index({ receiptId: 1 })       
receiptSchema.index({ createdAt: -1 })    
receiptSchema.index({ receiptNumber: 1 }) 
const Category = mongoose.model("Category", categorySchema);
const Receipt = mongoose.model("Receipt", receiptSchema);
const Wallet = mongoose.model("Wallet", walletSchema);

export { Category, Receipt, Wallet, Counter, History,Item };
