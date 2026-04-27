import User from "../models/user.model.js";
import Message from "../models/message.model.js";


export const getAllUsers=async(req , res)=>{
    try{
       const loggedInUser=req.user._id;

       const users=await User.find({_id:{$ne:loggedInUser}}).select("-password");

       res.status(200).json(users);
       console.log("users fetched successfully");

       
    }catch(error){
        res.status(500).json({message:"error in get all users controllers ",error:error.message});
        console.log("error in get all users controller");
        
    }
}

export const getMessages=async(req , res)=>{
    try{
       const {id:userToChatId}=req.params;
       const myId=req.user._id;

       const messages=await Message.find({
        $or:[
            {senderId:myId , receiverId:userToChatId},
            {senderId:userToChatId , receiverId:myId}
        ]
       })

       res.status(200).json(messages);

    }catch(error){
      console.log("error in get message controller ");
      res.status(500).json({message:"error in getMessage controller " , error:error.message});
    }
}


export const sendMessages=async(req , res)=>{
    try{
      const{text , image}= req.body;
      const senderId=req.user._id;
      const {id:receiverId}=req.params;

      let imageURL;
      if(image){
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageURL=uploadResponse.secure_url;

      }

      const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image:imageURL
      })

       await newMessage.save();

      res.status(200).json({message:"message sent successfully"});
      res.status(200).json(newMessage);


    }catch(error){
       console.log("error in send message controller ");
       res.status(500).json({message:"error in send message controller ", error:error.message});
    }
}