import files from "../controllers/files.controller.js";
import express from "express";
const router = express.Router();
router.get('/',files.getAllFiles);

//get single file by id
router.get('/:id',files.getSingleFile);

//create a new file,body('title').notempty().withMessage('Title is required'),const errors = validationResult(req);if(!errors.isEmpty()){return res.status(400).json({errors:errors.array()});}
router.post('/', files.addFile )

//update a file by id
router.patch('/:id',files.updateFile );
//delete a file by id
router.delete('/:id', files.deleteFile)

 export default router;
