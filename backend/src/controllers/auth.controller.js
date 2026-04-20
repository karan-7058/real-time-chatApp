import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup=async(req , res)=>{
    const{fullName , email , password}=req.body;

    try{
        if(!fullName || !email || !password){
            res.status(400).send("all fields are required");
        }

        if(password.length<8){
           res.status(400).send("pass must be 8 characters long");
        }

        const user=await User.findOne({email});

        if(user){
            res.status(400).send("user already exists");
        }

        const passHash=await bcrypt.hash(password , 10);

        const newUser=new User({
            fullName,
            email,
            password:passHash
        });

        if(newUser){

            generateToken(newUser._id , res);
            await newUser.save();
            
            res.status(201).send({
               _id:newUser._id,
               fullName:newUser.fullName,
               email:newUser.email,
               profilePic:newUser.profilePic

            });
          
        }else{
            res.status(400).send("invalid user data")
        }

    }catch(error){
        res.status(500).send("error in signup controller" ,error.message);

    }   
   
};


export const login=async(req , res)=>{
    const {email , password}=req.body;

    try{
        if(!email || !password){
            res.status(400).send("all fields are required");
        }

        const user=await User.findOne({email});

        if(!user){
            res.status(400).send("invalid credentials");
        }
        
        const isMatch=await bcrypt.compare(password , user.password);
        if(!isMatch){
            res.status(400).send("invalid credentials");
        }

        if(user && isMatch){
            generateToken(user._id , res);
            res.status(200).send({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic
            });
        }

    }catch(error){
        res.status(500).send("error in login controller" ,error.message);
    }

};


export const logout= async(req , res )=>{
    try {
        res.cookie("jwt" ,  "" , {
            maxAge:0
        })

        res.status(200).send("logged out successfully");

    } catch (error) {
        res.status(500).send("error in logout controller ");
        console.log("error in logout controller" , error.message);
        
    }

};

export const updateProfile=async(req , res)=>{
    const {profilePic}=req.body;
    const userId=req.user._id;

    try{
      if(!profilePic){
        return res.status(400).json({message:"profile picture is required"});
        console.error("profile picture is required");
      }

      const user=await User.findById(userId);
      if(!user){
        return res.status(400).json({message:"user not found"});
        console.error("user not found");
      }

      const uploadResponse=await cloudinary.uploader.upload(profilePic);
      const updatedUser=await User.findByIdAndUpdate(userId , {profilePic:uploadResponse.secure_url } , {new:true});
      res.status(200).json({message:"profile picture updated successfully" , user:updatedUser});
      

    }catch(error){
       return res.status(500).json({message:"error in update profile controller" , error:error.message});
       console.error("error in update profile controller" , error.message);
    };
    
};

export const checkAuth=(req , res)=>{
  try{
     res.status(200).json({user:req.user});
    
  }catch(error){
    res.status(500).json({message:"error in check auth controller" , error:error.message});
    console.log("error in check auth controller" , error.message);
  }
}
