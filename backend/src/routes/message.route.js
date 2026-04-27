import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers  , getMessages , sendMessages} from "../controllers/message.controller.js";


const router =express.Router();

router.get("/users" , protectRoute , getAllUsers);

router.get("/:id" , protectRoute , getMessages);

router.post("/:id" , protectRoute , sendMessages);




export default router;