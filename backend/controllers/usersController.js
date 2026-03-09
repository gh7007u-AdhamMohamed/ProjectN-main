import mongoose from "mongoose";
import User from "../models/user.model.js";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 import dotenv from "dotenv";
const getAllUsers = async(req,res)=>{
    try {
        const users = await User.find({}, { __v: 0, password: 0 });
        res.json({status:"success",data:users});
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
    }

};

const register= async(req,res,next)=>{
    const {firstName,lastName,email,password,role}=req.body;
    const olduser=await User.findOne({email})
    if(olduser){
        return res.status(400).json({status:"error",message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const newuser=new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    }); 
const token= await jwt.sign({email:newuser.email,id:newuser._id,role:newuser.role},process.env.JWT_SECRET,{expiresIn:"1h"});
newuser.token=token;
console.log(token);
    try {
        const savedUser = await newuser.save();
        res.status(201).json({status:"success",data:savedUser});
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
    }
}

const login= async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({status:"error",message:"Email and password are required"});
    }
    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({status:"error",message:"user not found please register"});
        }
       const match= await bcrypt.compare(password,user.password);

       if(match&&user){
        const token= await jwt.sign({email:user.email,id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"});

        res.status(200).json({status:"success",data:user,token});

       }else{
        res.status(400).json({status:"error",message:"Invalid email or password"});
       }
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
}}

export default {
    getAllUsers,
    register,
    login


};