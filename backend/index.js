import express from "express";
//import {body ,ValidationReuslt} from 'express-validator ';
import filesRoutes from "./routes/filesRoutes.js";
import mongoose from "mongoose";
import File from "./models/files.model.js";
import cors from "cors";
import usersRoutes from "./routes/usersRoutes.js";
import receiptRoutes from "./routes/receiptsRoutes.js";
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from "dotenv";
dotenv.config();
//const url = 'mongodb+srv://gh7007u_db_user:FileManger54@learnmongodb.xxuuapt.mongodb.net/FileManger';

const url = process.env.url

 await mongoose.connect(url).then(()=>{
    console.log("Connected to MongoDB");
})

const changeStream = File.watch();
changeStream.on("change", (change) => {
  console.log("DB changed:", change);
  // Optional: emit to frontend via Socket.IO
  // io.emit("fileChanged", change);
});


// initialize express app
const app = express();
//middleware to parse json body
app.use(express.json()); 
app.use(cors({
  origin: "https://project-n-main-qjzc.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());
const httpServer = createServer(app) 
const io = new Server(httpServer, {
  cors: { origin: "*" } 
})
app.use((req, res, next) => {
  req.io = io
  next()
})
app.use('/api/file',filesRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/receipt',receiptRoutes);


//server listening on port 5000
httpServer.listen(5000, '0.0.0.0', () => {
  console.log('Listening on port: 5000')
})
