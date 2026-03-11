import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({ 
       firstName: {
        type: String,
        required: true,}
        ,
       lastName: {
        type: String,
       required: true,},
       email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email address"],
        unique: true,
       },
       password: {
        type: String,
        required: true,
       
       },
       token:{
              type:String,
       },
       role:{
              type:String,
              enum:["user","admin","superUser"],
              default:"user"
       }
       
})




const User = mongoose.model("user", userSchema);
export default User;