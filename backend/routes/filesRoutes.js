import files from "../controllers/files.controller.js";
import express from "express";
import { levelValidator, validate } from "../validator.js";
const router = express.Router();
router.get('/',files.getAllFiles);

//get single file by id
router.get('/folders',files.getAllFolders);

router.get('/:id',files.getSingleFile);
//create a new file,body('title').notempty().withMessage('Title is required'),const errors = validationResult(req);if(!errors.isEmpty()){return res.status(400).json({errors:errors.array()});}
router.post('/', levelValidator,validate, files.addFile )

//update a file by id
router.patch('/:id',files.updateFile );
//delete a file by id
router.delete('/:id', files.deleteFile)

 export default router;
