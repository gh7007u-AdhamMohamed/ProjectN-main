import files from "../controllers/files.controller.js";
import express from "express";
import { levelValidator, validate } from "../validator.js";
import usersController from "../controllers/usersController.js";
import verifyToken from "./tokenver.js";
import allowed from "../Scripts/allowed.js";
const router = express.Router();
router.get('/',usersController.getAllUsers);
router.post('/register',usersController.register);
router.post('/login',usersController.login);
router.post('/change-password', verifyToken, allowed('admin'), usersController.changePassword);

 export default router;
