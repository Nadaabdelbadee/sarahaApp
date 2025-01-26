import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/users.model.js";
import { asyncHandler } from "../../utilities/errorHandling.js";


// =============================== sendMessage ===============================

export const sendMessage = asyncHandler(async(req,res,next)=>{
    const {content , userId} = req.body;
    if (!await userModel.findOne({_id:userId , isDeleted:false})) {
        return next(new Error("user not found" , {cause:400}))
    }
    const message = await messageModel.create({content , userId})
    return res.status(200).json({msg:"done" , message})
})



// =============================== getMessages ===============================

export const getMessages = asyncHandler(async(req,res,next)=>{
    const message = await messageModel.find({userId:req.user._id})
    return res.status(200).json({msg:"done" , message})
})

