import files from "../controllers/files.controller.js";
import express from "express";
import { levelValidator, validate } from "../validator.js";
import receiptController from "../controllers/receiptController.js";
import verifyToken from "./tokenver.js";
import allowed from "../Scripts/allowed.js";
import { Admin } from "mongodb";
const router = express.Router();
router.post('/',receiptController.addReceipt);
router.get('/',receiptController.getAllReceipts);
router.put('/:id',verifyToken,allowed(Admin),receiptController.updateReceipt);
router.delete('/:id',verifyToken,allowed(Admin),receiptController.deleteReceipt);
router.get('/sort',receiptController.sortReceipts);
router.get('/search',receiptController.searchReceipts);
router.get('/report',receiptController.getReceiptReport);
router.post('/wallet',verifyToken,allowed(Admin),receiptController.updateWallet);
router.get('/wallet',verifyToken,allowed(Admin),receiptController.getWallet);


 export default router;
