import files from "../controllers/files.controller.js";
import express from "express";
import { levelValidator, validate } from "../validator.js";
import receiptController from "../controllers/receiptController.js";
const router = express.Router();
router.get('/',receiptController.getAllFiles);
//router.post('/register',receiptController.addFile);
//router.post('/login',receiptController.updateFile);
//router.delete('/:id',receiptController.deleteFile);


 export default router;
