import File from "../models/files.model.js";
import mongoose from "mongoose";

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
const updateFile = async (req,res)=>{
const courseId = req.params.id;
const updatedFile = await File.findByIdAndUpdate(courseId,{$set: req.body}, { new: true });
res.json(updatedFile);
}; 

const deleteFile = async(req,res)=>{
    try {
        const fileId = req.params.id;
        const deletedFile = await File.findByIdAndDelete(mongoose.Types.ObjectId(fileId));

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
    addFile,
    updateFile,
    deleteFile,
    getAllFiles,
    getSingleFile
};