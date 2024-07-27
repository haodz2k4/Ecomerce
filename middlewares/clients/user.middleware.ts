import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
export const user = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {

    if(!req.headers.authorization){
        next();
        return;
    }
    const token = req.headers.authorization.split(" ")[0];
    const user = await User.findOne({token});

    if(!user){
        next();
        return; 
    }

    res.locals.user = user;

    next();
}