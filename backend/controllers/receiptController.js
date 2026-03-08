import File from "../models/files.model.js";
import mongoose from "mongoose";
import { Receipt, Wallet, Counter } from "../models/receipt.model.js";


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

    await Wallet.findOneAndUpdate(
      {},
      { $inc: { totalBalance: -amount } },
      { upsert: true }
    );

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

    // Keep old amount if not provided
    const newAmount = req.body.amount !== undefined ? req.body.amount : findReceipt.amount;

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptid,
      { ...req.body, amount: newAmount },
      { new: true }
    );

    const updateWallet = await Wallet.findOneAndUpdate(
      {},
      { $inc: { totalBalance: findReceipt.amount - updatedReceipt.amount } },
      { new: true, upsert: true }
    );

    res.status(200).json({ updatedReceipt, updateWallet });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReceipt = async(req,res)=>{
    try {
       const receiptId=req.params.id;
       const deletedReceipt = await Receipt.findByIdAndDelete(receiptId);

        if (!deletedReceipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }

        const updatewallet = await Wallet.findOneAndUpdate(
            {},
            { $inc: { totalBalance: +deletedReceipt.amount } },
            { upsert: true }
          );
            res.status(200).json({ message: "Receipt deleted successfully", deletedReceipt, updatewallet });

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

export default {
    addReceipt,
    getAllReceipts,
    updateReceipt,
    deleteReceipt,
    getReceiptReport,
    sortReceipts,
    searchReceipts,
    updateWallet,
    getWallet
};