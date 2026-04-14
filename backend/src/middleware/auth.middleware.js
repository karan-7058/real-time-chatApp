import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute=async(req , res , next)=>{
    try{
      const token = req.cookies.jwt;
      if(!token){
        return res.status(401).json({message:"user not authorized , please login first"});
        console.error("user not authorized , please login first");    
      }
      const decoded=jwt.verify(token , process.env.JWT_SECRET);
      const user=await User.findById(decoded.userId).select("-password");

      if(!decoded){
        return res.status(401).json({message:"invalid token"});
      }

      if(!user){
        return res.status(401).json({message:"user not found"});
        console.error("user not found");
      }

      req.user=user;
      next();


    }catch(error) {
        return res.status(500).json({message:"error in protected route middleware " , error:error.message});
        console.log("error in protected route middleware" , error.message);
    }
}

