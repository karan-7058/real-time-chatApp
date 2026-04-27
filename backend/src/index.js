import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();


dotenv.config();

const PORT = process.env.PORT || 3000;

// Parse JSON / form bodies so req.body is defined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth" , authRoutes);
app.use("/api/message" , messageRoutes);


app.listen(PORT, ()=>{
    console.log("server is running on port 3000");
    connectDB();

})

