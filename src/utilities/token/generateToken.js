import jwt from "jsonwebtoken";

export const GenerateToken = async ({ payload = {}, Signature, option }) => {
  return jwt.sign(payload, Signature, option);
};
