import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
},{timestamps:true});


const messageModel = mongoose.models.Message || mongoose.model("message" , messageSchema)

export default messageModel