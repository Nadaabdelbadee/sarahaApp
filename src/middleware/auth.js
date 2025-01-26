import jwt from "jsonwebtoken";
import userModel from "../DB/models/users.model.js";
import { asyncHandler } from "../utilities/errorHandling.js";

export const roles = {
  user: "user",
  admin: "admin",
};

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    return next(new Error("token not found", { cause: 400 }));
  }
  let SIGNATURE = undefined;
  if (prefix === "admin") {
    SIGNATURE = process.env.SECRET_KEY_ADMIN;
  } else if (prefix === "bearer") {
    SIGNATURE = process.env.SECRET_KEY_USER;
  } else {
    return next(new Error("invalid token prefix", { cause: 401 }));
  }

  const decoded = jwt.verify(token, SIGNATURE);

  if (!decoded?.id) {
    return next(new Error("invalid token payload", { cause: 400 }));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  req.user = user;
  if (user.isDeleted) {
    return next(new Error("user deleted", { cause: 401 }));
  }
  // if (parseInt(user.passwordChangedAT.getTime() / 1000) > decoded.iat) {
  //   return next(new Error("expired Token", { cause: 401 }));
  // }
  next();
});

export const authorization = (role = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new Error("Access denied", { cause: 403 }));
    }
    next();
  });
};
