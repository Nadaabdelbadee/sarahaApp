import { Router } from "express";
import { confirmEmail, FreezeAccount, getProfile, shareProfile, SignIn, SignUp, UpdatePassword, UpdateProfile } from "./users.service.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validate } from "../../middleware/validation.js";
import { FreezeAccountSchema, shareProfileSchema, signUpSchema, updatePasswordSchema, UpdateProfileSchema } from "./user.validation.js";

const userRouter = Router();

userRouter.post("/SignUp",validate(signUpSchema), SignUp);
userRouter.get("/SignIn", SignIn);
userRouter.get("/confirmEmail/:token", confirmEmail);
userRouter.get("/profile", authentication , authorization([roles.user]), getProfile);
userRouter.get("/profile/:id",validate(shareProfileSchema), shareProfile);
userRouter.patch("/update",validate(UpdateProfileSchema),authentication, UpdateProfile);
userRouter.patch("/update/password",validate(updatePasswordSchema),authentication, UpdatePassword);
userRouter.delete("/freeze",validate(FreezeAccountSchema),authentication, FreezeAccount);

export default userRouter;
