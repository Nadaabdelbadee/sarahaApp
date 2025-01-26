import Joi from "joi";
import { generalRules } from "../../utilities/generalRules/generalRules.js";

export const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().min(1).max(100).required(),
    userId: generalRules.id.required(),
  }),
};
