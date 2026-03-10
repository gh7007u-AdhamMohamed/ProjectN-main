import express from "express";
import receiptController from "../controllers/receiptController.js";
import verifyToken from "./tokenver.js";
import allowed from "../Scripts/allowed.js";

const router = express.Router();

router.post('/', receiptController.addReceipt);
router.get('/', receiptController.getAllReceipts);
router.get('/sort', receiptController.sortReceipts);
router.get('/search', receiptController.searchReceipts);
router.get('/report', receiptController.getReceiptReport);

router.put('/:id', verifyToken, allowed('admin'), receiptController.updateReceipt);
router.delete('/:id', verifyToken, allowed('admin'), receiptController.deleteReceipt);
router.post('/wallet', verifyToken, allowed('admin'), receiptController.updateWallet);
router.get('/wallet', verifyToken, allowed('admin'), receiptController.getWallet);

export default router;