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

const getAllFiles = (req,res)=>{
res.json(
    {
        "id":1
    }
);
};

const getSingleFile =  (req,res)=>{
const couseId = req.params.id;
console.log(couseId);
res.json({
    "id": couseId
});
};
module.exports = {
    addFile,
    updateFile,
    deleteFile,
    getAllFiles,
    getSingleFile
};