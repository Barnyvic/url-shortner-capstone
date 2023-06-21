import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

export const generateToken = async (payload: any, Secret = jwtSecret) => {
  const token = await jwt.sign(payload, Secret, {
    expiresIn: "4h",
  });
  return token;
};