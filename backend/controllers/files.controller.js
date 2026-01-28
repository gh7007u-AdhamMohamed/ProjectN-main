import File from "../models/files.model.js";
import mongoose from "mongoose";
import { validate } from "../validator.js";
const addFile = async (req,res)=>{
    try {
    const fileData = req.body;
    const { name, type, path, level, parent_id } = req.body;

    const file = new File({
      name,
      type ,
      path,
      level,
      parent_id
    });
    
    await file.save(); 
    
    res.status(201).json({
      message: "File created successfully",
      file
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating file",
      error: error.message
    });
  };

}
const updateFile = (req,res)=>{
const couseId = +req.params.id;
console.log(couseId);

};

const deleteFile = (req,res)=>{
const couseId = +req.params.id;
console.log(couseId); 
};

const getAllFiles = async(req,res)=>{
const files= await File.find();
res.json(files);
};

const getSingleFile = async(req,res)=>{
 try {
    const fileId = req.params.id;
    const file= await File.findById(mongoose.Types.ObjectId(fileId));
    if(!file){
        return res.status(404).json({message:"File not found"});
    }
    res.json(file);
 }catch (error) {
    res.status(500).json({message:error.message});
}}
export default {
    addFile,
    updateFile,
    deleteFile,
    getAllFiles,
    getSingleFile
};