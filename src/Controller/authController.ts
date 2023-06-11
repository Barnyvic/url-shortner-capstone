import User from "../model/userModel";
import { Request, Response } from "express";
import { errorResponse, handleError, successResponse } from '../utils/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;

        if(!email || !password || !fullName) {
            return errorResponse(res, 400, "All fields are required");
        }

      const userExist = await User.findOne({ email });
        if (userExist) {
            return errorResponse(res, 400, "User already exist");
        }
    
        const user = new User({
        email,
        fullName,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        });

    const salt: string = await bcrypt.genSalt(10);

      user.password = bcrypt.hashSync(password, salt);

      await user.save();
    
     return   successResponse(res, 201, "User created successfully", user);
    } catch (err) {
         handleError(req, err);
        return errorResponse(res, 500, 'Server error.');
    }
    }

export const login = async (req: Request, res: Response) => {

     try {
        

         const { email, password } = req.body;

          if(!email || !password) {
            return errorResponse(res, 400, "All fields are required");
        }

      const user = await User.findOne({ email });

      if(!user || !user.comparePassword(password) ) {
        return errorResponse(res, 400, "Invalid credentials");
      }

      const payload = {
        id: user._id,
        email: user.email,
      };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
        });

        res.cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        httpOnly: true,
        });

        return successResponse(res, 200, "Login successful", token);

     } catch (error) {
            handleError(req, error);
            return errorResponse(res, 500, 'Server error.');
     }


}