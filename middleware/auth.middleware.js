import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { User } from "../schema/userRegister.schema.js";
dotenv.config()
export const authMiddleware=async(req,res,next)=>{
  try {
    const token=req.headers.authorization.split(" ")[1];
    console.log(token)
    if(!token){
        return res.status(401).json({
            message:"token is missing"
        })
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decode._id);
    if(!user){
        return res.status(401).json({
            message:"invalid user"
        })
    }
    req.user=user
    next();
  } catch (error) {
        console.log("error executing in catch block")
        return res.status(401).json({
            message:error.message
        })
    
  }
}