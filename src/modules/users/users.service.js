import userModel from "../../DB/models/users.model.js";
import { asyncHandler } from "../../utilities/errorHandling.js";
import { Error } from "mongoose";
import { eventEmitter } from "../../utilities/sendEmail.event.js";
import { Hash } from "../../utilities/hash/hash.js";
import { Compare } from "../../utilities/hash/compare.js";
import { Encrypt } from "../../utilities/encrypt/encrypt.js";
import { GenerateToken } from "../../utilities/token/generateToken.js";
import { Verify } from "../../utilities/token/verify.js";
import { Decrypt } from "../../utilities/encrypt/decrypt.js";




// =============================== signUp ===============================
export const SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, cPassword, phone, gender } = req.body;
  //check cPassword equal password
  if (password !== cPassword) {
    return next(new Error("password do not match", { cause: 400 }));
  }
  // check email exist or not
  const existEmail = await userModel.findOne({ email });
  if (existEmail) {
    return next(new Error("email already exist"));
  }
  // hash password
  const hash = await Hash({ password, SALT_ROUNDS: process.env.SALT_ROUNDS });
  //encrypt phone
  const encryptPhone = await Encrypt({
    key: req.body.phone,
    SECRET_KEY: process.env.SIGNATURE,
  });
  // confirm email

  eventEmitter.emit("sendEmail", { email });

  // create
  const user = await userModel.create({
    name,
    email,
    password: hash,
    phone: encryptPhone,
    gender,
  });
  return res.status(201).json({ msg: "done", user });
});
// ================================= confirmEmail =================================

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(new Error("token not found"));
  }
  const decoded = await Verify({
    token,
    SIGNATURE: process.env.SIGNATURE_CONFIRMATION,
  });
  if (!decoded?.email) {
    return next(new Error("invalid token payload"));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    {
      confirmed: true,
    }
  );
  if (!user) {
    return next(new Error("user not found or already confirmed"));
  }
  return res.status(201).json({ msg: "done" });
});

// ================================= SignIn =================================

export const SignIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, confirmed: true });
  if (!user) {
    return next(new Error("invalid email or not confirmed yet"));
  }
  const match = await Compare({ password, hashed: user.password });
  if (!match) {
    return next(new Error("invalid password"));
  }
  // create token
  const token = await GenerateToken({
    payload: { email, id: user._id },
    Signature:
      user.role == "user"
        ? process.env.SECRET_KEY_USER
        : process.env.SECRET_KEY_ADMIN,
  });

  return res.status(201).json({ msg: "done", token });
});
// ================================= get profile =================================
export const getProfile = asyncHandler(async (req, res, next) => {
  //decrypt phone
  req.user.phone = await Decrypt({
    key: req.user.phone,
    SECRET_KEY: process.env.SIGNATURE,
  });
  return res.status(201).json({ msg: "done", user: req.user });
});
// ================================= share profile =================================
export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select("name email gender");
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  return res.status(201).json({ msg: "done", user });
});
// ================================= Update Profile =================================
export const UpdateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await Encrypt({
      key: req.body.phone,
      SECRET_KEY: process.env.SIGNATURE,
    });
  }
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  return res.status(201).json({ msg: "done", user });
});
// ================================= Update password =================================

export const UpdatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await Compare({ password: oldPassword, hashed: req.user.password }))) {
    return next(new Error("Invalid old password", { cause: 400 }));
  }
  const hash = await Hash({
    password: newPassword,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hash, passwordChangedAT: Date.now() },
    {
      new: true,
    }
  );

  return res.status(201).json({ msg: "done", user });
});
// ================================= FreezeAccount(soft delete) =================================

export const FreezeAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true },
    { new: true }
  );

  return res.status(201).json({ msg: "done", user });
});
