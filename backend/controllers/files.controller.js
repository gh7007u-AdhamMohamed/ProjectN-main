import File from "../models/files.model.js";


const addFile = (req,res)=>{
    console.log(req.body);
    res.json({
        "message": "File created successfully"
    });
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

const getSingleFile =  (req,res)=>{
const couseId = req.params.id;
console.log(couseId);
res.json({
    "id": couseId
});
};
export default {
    addFile,
    updateFile,
    deleteFile,
    getAllFiles,
    getSingleFile
};