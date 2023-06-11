import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../model/userModel';
import { errorResponse, handleError } from '../utils/response';
import { IRequest } from '../utils/response';


const verifyToken = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
         if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]; // Bearer <token>
            if (authorization) {
                const decoded = jwt.verify(authorization, process.env.JWT_SECRET as string) ;
                const user = await User.findById(decoded.id);
                if (!user) {
                    return errorResponse(res, 404, "user not found");
                }

                req.user = user;
                next();
            } else {
                return errorResponse(res, 401, "Unauthorized access");
            }
         }
    } catch (error) {
        handleError(req, error);
        return errorResponse(res, 500, 'Server error.'); 
    }
}



export default verifyToken;