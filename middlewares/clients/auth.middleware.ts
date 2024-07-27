import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    if(!req.headers.authorization){
        res.status(401).json({message: "Vui lòng gửi token người dùng"}) ;
        return;

    }
    const token = req.headers.authorization.split(" ")[0];
    const user = await User.exists({token});
    if(!user){
        res.status(401).json({message: "Token của bạn gửi không hợp lệ"});
        return;
    }


    next()
}