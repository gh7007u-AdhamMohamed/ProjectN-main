import express from "express";
import {body ,ValidationReuslt} from 'express-validator ';
import files from "./controllers/files.controller.js";
import filesRoutes from "./routes/filesRoutes.js";
// initialize express app
const app = express();
//middleware to parse json body
app.use(express.json()); 
app.use('/api/file',filesRoutes);


//server listening on port 5000
app.listen(5000, () => {
  console.log("Listening on port: 5000");
});
