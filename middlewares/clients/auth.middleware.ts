import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    if(!req.headers.authorization){
        res.status(401).json({message: "Vui lòng gửi token người dùng"}) ;
        return;

    } 

    const token = req.headers.authorization.split(" ")[1]; 
    const encode: any = jwt.verify(token,process.env.JWT_TOKEN as string);
    const user = await User.findById(encode?.userId);
    if(!user){
        res.status(401).json({message: "Token của bạn gửi không hợp lệ"});
        return;
    }
    res.locals.user = user;

    next()
}