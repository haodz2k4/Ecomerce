import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
export const user = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {

    if(!req.headers.authorization){
        next();
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(process.env.JWT_SECRET)
    const encode: any = jwt.verify(token,process.env.JWT_SECRET as string);
    const user = await User.findById(encode.userId);

    res.locals.user = user;

    next();
}