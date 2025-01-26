import { Router } from "express";
import { deleteMessage, getMessages, sendMessage } from "./messages.service.js";
import { validate } from "../../middleware/validation.js";
import { sendMessageSchema } from "./messages.validation.js";
import { authentication } from "../../middleware/auth.js";



const MessageRouter = Router()

MessageRouter.post("/" ,validate(sendMessageSchema), sendMessage)
MessageRouter.get("/" ,authentication, getMessages)
MessageRouter.delete("/delete/:id" ,authentication, deleteMessage)


export default MessageRouter