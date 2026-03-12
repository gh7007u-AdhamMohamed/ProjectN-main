import File from "../models/files.model.js";
import mongoose from "mongoose";
import { Receipt, Wallet, Counter, History } from "../models/receipt.model.js"; // Added History

const addReceipt = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "receiptId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nextNumber = counter.seq;
    const { name, description, amount, category, date } = req.body;

    const receipt = new Receipt({
      receiptNumber: nextNumber,
      name,
      description,
      amount,
      category,
      date
    });

    await receipt.save();

    
    res.status(201).json({ receipt, nextNumber });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReceipts = async(req,res)=>{
    try{
        const receipts = await Receipt.find();
        res.json(receipts);
    }catch (error) {
        res.status(500).json({ message: error.message });}  
};

const sortReceipts = async (req, res) => {
  try {
    const { date, category } = req.query;

    let dateFilter = {};
    let categoryFilter = {};

    if (date === "asc") {
      dateFilter = { date: 1 };
    } else if (date === "desc") {
      dateFilter = { date: -1 };
    }

    if (category) {
      categoryFilter = { category: category };
    }

    const receipts = await Receipt.find(categoryFilter).sort(dateFilter);

    res.json(receipts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReceipt = async (req,res) => {
  try {
    const receiptid = req.params.id;
    const findReceipt = await Receipt.findById(receiptid);
    if (!findReceipt) return res.status(404).json({ message: "Receipt not found" });


    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptid,
      { ...req.body },
      { new: true }
    );

   
    res.status(200).json({ updatedReceipt });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReceipt = async(req,res)=>{
    try {
       const receiptId=req.params.id;
       const receipt=await Receipt.findById(receiptId);
       if(!receipt.purchased){
       const deletedReceipt = await Receipt.findByIdAndDelete(receiptId);

        if (!deletedReceipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }

        
            res.status(200).json({ message: "Receipt deleted successfully", deletedReceipt });
      }
      else
      {
        res.status(403).json({ message: "Cannot delete purchased receipt" });      }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchReceipts = async (req, res) => {
  try {
    const { query } = req.query; 
    let filter = {};

    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },         // partial, case-insensitive
          { description: { $regex: query, $options: "i" } },  // partial, case-insensitive
          { receiptNumber: Number(query) || -1 },             // exact number
            ]
      };
    }

    const receipts = await Receipt.find(filter).sort({ date: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWallet = async(req,res)=>{
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      {},
      { $inc: { totalBalance: amount } },
        { new: true, upsert: true }
    );
    res.json(wallet);
    const history = await History.create({
      amount,
      type: "addMoney"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const resetWallet = async (req, res) => {
  try {
     const wallett = await Wallet.findOne({});
     await History.create({
      amount:wallett.totalBalance,
      type:"reset"
     })
    const wallet = await Wallet.findOneAndUpdate(
      {}, 
      { $set: { totalBalance: 0 } }, 
      { new: true, upsert: true }
    );
    
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getWallet = async(req,res)=>{
  try {
    const wallet = await Wallet.findOne({});
    res.json(wallet);
    } catch (error) {   
    res.status(500).json({ message: error.message });
    }
};

const getReceiptReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const receipts = await Receipt.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeApprovalStatus = async (req, res) => {
    try{
        const receiptId = req.params.id;
        const receipe=await Receipt.findById(receiptId);
        if(!receipe){
            return res.status(404).json({message:"Receipt not found"});
        }
        const { approvalStatus } = req.body;
        const updatedReceipt = await Receipt.findByIdAndUpdate(
            receiptId,
            { approvalStatus },
            { new: true }
        );
        res.json(updatedReceipt);
    }catch (error) {
        res.status(500).json({ message: error.message });   
    }

;}
const togglePurchase = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    if (!receipt.purchased) {
      await Wallet.findOneAndUpdate({}, { $inc: { totalBalance: -receipt.amount } }, { upsert: true });
      await History.create({ receiptId: receipt._id, amount: receipt.amount });
      await Receipt.findByIdAndUpdate(req.params.id, { purchased: true });
    } else {
      await Wallet.findOneAndUpdate({}, { $inc: { totalBalance: receipt.amount } }, { upsert: true });
      await History.findOneAndDelete({ receiptId: receipt._id });
      await Receipt.findByIdAndUpdate(req.params.id, { purchased: false });
    }
  const updatedReceipt = await Receipt.findById(req.params.id);
  res.status(200).json({ purchased: updatedReceipt.purchased });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const toggleApproval = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    const newStatus = receipt.approvalStatus === "approved" ? "pending" : "approved";

    const updated = await Receipt.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: newStatus },
      { new: true }
    );

    res.status(200).json({ approvalStatus: updated.approvalStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
    addReceipt,
    getAllReceipts,
    updateReceipt,
    deleteReceipt,
    getReceiptReport,
    sortReceipts,
    searchReceipts,
    updateWallet,
    getWallet,
    changeApprovalStatus,
    togglePurchase,
    toggleApproval,
    resetWallet
};