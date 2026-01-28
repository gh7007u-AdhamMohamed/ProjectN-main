import express from "express";
//import {body ,ValidationReuslt} from 'express-validator ';
import filesRoutes from "./routes/filesRoutes.js";
import mongoose from "mongoose";
import File from "./models/files.model.js";
const url = 'mongodb+srv://gh7007u_db_user:FileManger54@learnmongodb.xxuuapt.mongodb.net/FileManger';

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
app.use('/api/file',filesRoutes);


//server listening on port 5000
app.listen(5000, () => {
  console.log("Listening on port: 5000");
});
