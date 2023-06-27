import User from "../model/userModel";
import { Request, Response } from "express";
import { errorResponse, handleError, successResponse } from '../utils/response';
import bcrypt from 'bcrypt';
import { comparePassword } from "../helper/comparePassward";
import { generateToken } from "../helper/JwtHelper";

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Server error
 */


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

  
    /**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 400, "User not  found");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 400, "Invalid Password");
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = await generateToken(payload);

    return successResponse(res, 200, "Login successful", token);
  } catch (error) {
    handleError(req, error);
    return errorResponse(res, 500, "Server error.");
  }
};
