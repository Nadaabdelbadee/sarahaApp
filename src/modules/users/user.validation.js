import Joi from "joi";
import { enumGender } from "../../DB/models/users.model.js";
import { generalRules } from "../../utilities/generalRules/generalRules.js";

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    gender: Joi.string().valid(enumGender.female, enumGender.male).required(),
    phone: Joi.string()
      .regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)
      .required(),
  }),
};



export const UpdateProfileSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(10),
    gender: Joi.string().valid(enumGender.female, enumGender.male),
    phone: Joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
  }),
  headers: generalRules.headers.required(),
};



export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(Joi.ref("newPassword")).required(),
  }),
  headers: generalRules.headers.required(),
};



export const FreezeAccountSchema = {
  headers: generalRules.headers.required(),
};



export const shareProfileSchema = {
  params: Joi.object({
    id:generalRules.id.required()
  }),
};

