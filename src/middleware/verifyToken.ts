import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../model/userModel';
import { errorResponse, handleError } from '../utils/response';
import { IRequest } from '../utils/response';


const verifyToken = async (req: IRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 404, "user not found");
        }

        req.user = user;
        next();
        
    } catch (error) {
        handleError(req, error);
        return errorResponse(res, 500, 'Server error.'); 
    }
}



export default verifyToken;