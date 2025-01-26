import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import { sendEmail } from "../service/sendEmail.js";
import { GenerateToken } from "./token/generateToken.js";
export const eventEmitter = new EventEmitter();
eventEmitter.on("sendEmail", async (data) => {
  const { email } = data;
  // const token = jwt.sign({ email }, process.env.SIGNATURE_CONFIRMATION);
  const token = await GenerateToken({
    payload: { email },
    Signature: process.env.SIGNATURE_CONFIRMATION,
    option: { expiresIn: "10m" },
  });
  const link = `http://localhost:${process.env.port}/users/confirmEmail/${token}`;
  await sendEmail(
    email,
    "confirm email",
    `<a href="${link}">Confirm email</a>`
  );
});
