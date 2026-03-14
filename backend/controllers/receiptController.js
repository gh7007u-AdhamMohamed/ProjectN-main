import File from "../models/files.model.js";
import mongoose from "mongoose";
import { Receipt, Wallet, Counter, History, Item } from "../models/receipt.model.js";

// ── CREATE receipt + items in one shot ──────────────────────────────
const addReceipt = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "receiptId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const { name, date, items: itemsPayload } = req.body;
    // items: [{ count, description, price }]

    const amount = (itemsPayload || []).reduce(
      (sum, i) => sum + Number(i.count) * Number(i.price), 0
    );

    const receipt = new Receipt({
      receiptNumber: counter.seq,
      name,
      amount,
      date,
    });

    await receipt.save();

    // Save items linked to this receipt
    let savedItems = [];
    if (itemsPayload?.length) {
      savedItems = await Item.insertMany(
        itemsPayload.map((i) => ({
          receiptId: receipt._id,
          count: Number(i.count),
          description: i.description,
          price: Number(i.price),
        }))
      );
    }

    const fullReceipt = { ...receipt.toObject(), items: savedItems };
    req.io.emit("newReceipt", fullReceipt);
    res.status(201).json(fullReceipt);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET all receipts with their items ───────────────────────────────
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    const receiptsWithItems = await Promise.all(
      receipts.map(async (r) => {
        const items = await Item.find({ receiptId: r._id });
        return { ...r.toObject(), items };
      })
    );
    res.json(receiptsWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE receipt header + replace all items ───────────────────────
const updateReceipt = async (req, res) => {
  try {
    const receiptId = req.params.id;
    const findReceipt = await Receipt.findById(receiptId);
    if (!findReceipt) return res.status(404).json({ message: "Receipt not found" });

    const { name, date, items: itemsPayload } = req.body;

    // Replace old items with new ones
    await Item.deleteMany({ receiptId });

    let savedItems = [];
    if (itemsPayload?.length) {
      savedItems = await Item.insertMany(
        itemsPayload.map((i) => ({
          receiptId,
          count: Number(i.count),
          description: i.description,
          price: Number(i.price),
        }))
      );
    }

    // Recalculate amount from new items
    const amount = savedItems.reduce((s, i) => s + i.count * i.price, 0);

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptId,
      { name, date, amount },
      { new: true }
    );

    res.status(200).json({ ...updatedReceipt.toObject(), items: savedItems });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE receipt + its items ───────────────────────────────────────
const deleteReceipt = async (req, res) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Receipt.findById(receiptId);

    if (!receipt.purchased) {
      await Item.deleteMany({ receiptId });                         // ← delete items too
      const deletedReceipt = await Receipt.findByIdAndDelete(receiptId);

      if (!deletedReceipt)
        return res.status(404).json({ message: "Receipt not found" });

      res.status(200).json({ message: "Receipt deleted successfully", deletedReceipt });
    } else {
      res.status(403).json({ message: "Cannot delete purchased receipt" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── TOGGLE approval — emit full receipt with items ───────────────────
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

    const items = await Item.find({ receiptId: updated._id });
    const fullUpdated = { ...updated.toObject(), items };

    req.io.emit("approvalUpdated", fullUpdated);                   // ← include items
    res.status(200).json({ approvalStatus: updated.approvalStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── TOGGLE purchase ──────────────────────────────────────────────────
const togglePurchase = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    if (!receipt.purchased) {
      await Promise.all([
        Wallet.findOneAndUpdate({}, { $inc: { totalBalance: -receipt.amount } }, { upsert: true }),
        History.create({ receiptId: receipt._id, amount: receipt.amount }),
        Receipt.findByIdAndUpdate(req.params.id, { purchased: true }),
      ]);
      return res.status(200).json({ purchased: true });
    } else {
      await Promise.all([
        Wallet.findOneAndUpdate({}, { $inc: { totalBalance: receipt.amount } }, { upsert: true }),
        History.findOneAndDelete({ receiptId: receipt._id }),
        Receipt.findByIdAndUpdate(req.params.id, { purchased: false }),
      ]);
      return res.status(200).json({ purchased: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE single item → recalculate receipt amount ──────────────────
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Recalculate and persist new amount
    const remaining = await Item.find({ receiptId: item.receiptId });
    const newAmount = remaining.reduce((s, i) => s + i.count * i.price, 0);
    await Receipt.findByIdAndUpdate(item.receiptId, { amount: newAmount });

    res.status(200).json({ item, newAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Unchanged functions ──────────────────────────────────────────────
const sortReceipts = async (req, res) => {
  try {
    const { date, category } = req.query;
    let dateFilter = {};
    if (date === "asc") dateFilter = { date: 1 };
    else if (date === "desc") dateFilter = { date: -1 };
    const receipts = await Receipt.find().sort(dateFilter);
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      {},
      { $inc: { totalBalance: amount } },
      { new: true, upsert: true }
    );
    res.json(wallet);
    await History.create({ amount, type: "addMoney" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetWallet = async (req, res) => {
  try {
    const wallett = await Wallet.findOne({});
    await History.create({ amount: wallett.totalBalance, type: "reset" });
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

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({});
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceiptReport = async (req, res) => {
  try {
    const { receipeNumber, endNumber } = req.query;
    const receipts = await Receipt.find({
      receiptNumber: { $gte: receipeNumber, $lte: endNumber }
    });

    // Populate items for each receipt
    const receiptsWithItems = await Promise.all(
      receipts.map(async (r) => {
        const items = await Item.find({ receiptId: r._id });
        return { ...r.toObject(), items };
      })
    );

    const sum = receiptsWithItems.reduce((s, x) => s + x.amount, 0);

    res.json({ data: receiptsWithItems, totalAmount: sum });
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
          { name: { $regex: query, $options: "i" } },
          { receiptNumber: Number(query) || -1 },
        ],
      };
    }
    const receipts = await Receipt.find(filter).sort({ date: -1 });
    const receiptsWithItems = await Promise.all(
      receipts.map(async (r) => {
        const items = await Item.find({ receiptId: r._id });
        return { ...r.toObject(), items };
      })
    );
    res.json(receiptsWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeApprovalStatus = async (req, res) => {
  try {
    const receiptId = req.params.id;
    const receipe = await Receipt.findById(receiptId);
    if (!receipe) return res.status(404).json({ message: "Receipt not found" });
    const { approvalStatus } = req.body;
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptId,
      { approvalStatus },
      { new: true }
    );
    req.io.emit("approvalUpdated", updatedReceipt);
    res.json(updatedReceipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItems = async (req, res) => {
  try {
    const items = req.body;
    const newItems = await Item.insertMany(items);
    res.status(201).json(newItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 })
    res.json(history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
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
  resetWallet,
  addItems,
  deleteItem,
  getItems,
  getHistory
};