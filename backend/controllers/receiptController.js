import File from "../models/files.model.js";
import mongoose from "mongoose";
import { Receipt, Wallet, Counter } from "../models/receipt.model.js";


const addReceipt = async (req,res)=>{

    try {
    const counter = await Counter.findOneAndUpdate(
    { id: "receiptId" }, 
    { $inc: { seq: 1 } }, 
    { new: true }
    );

    const nextNumber = counter.seq;
    const {  name, description, amount, category, date } = req.body;
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
      { $inc: { totalBalance: -receipt.amount } }, 
      { session, upsert: true }
    );
        res.status(201).json({receipt,nextNumber});

}catch (error) {
    res.status(500).json({ message: error.message });
}}

const getAllReceipts = async(req,res)=>{
    try{
        const receipts = await Receipt.find();
        res.json(receipts);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }   }



const updateFile = async (req,res)=>{
  try{
const courseId = req.params.id;
const updatedFile = await File.updateOne({_id: courseId},{$set: req.body});
res.status(200).json(updatedFile);
}catch (error) {
    res.status(500).json({ message: error.message }); 
}; 
}

const deleteFile = async(req,res)=>{
    try {
       const fileId=req.params.id;
       const deletedFile= await File.deleteOne({_id:fileId})

        if (!deletedFile) {
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json({ message: "File deleted successfully", deletedFile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFiles = async(req,res)=>{
const files= await File.find();
res.json(files);
};
const getAllFolders = async (req, res) => {
  try {
    const folders = await File.find({
      level: 1,
      type: "folder",
      
    });

    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSingleFile = async(req,res)=>{
 try {
    const fileId = req.params.id;
    const file= await File.findById(fileId);
    if(!file){
        return res.status(404).json({message:"File not found"});
    }
    res.json(file);
 }catch (error) {
    res.status(500).json({ message: "invalid file id"});
}}
export default {
    addReceipt
};