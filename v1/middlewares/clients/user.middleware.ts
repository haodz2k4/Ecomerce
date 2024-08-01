import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
export const user = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {

    if(!req.headers.authorization){
        next();
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const encode: any = jwt.verify(token,process.env.JWT_SECRET as string);
        const user = await User.findById(encode.userId);
    
        res.locals.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Token đã hết hạn" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Token không hợp lệ" });
        }else{
            next(error);
        }
    }

    
}