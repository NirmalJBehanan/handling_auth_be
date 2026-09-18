import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},
{
timestamps: true
}
)
export const User=mongoose.model("User",userSchema)