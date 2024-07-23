import { Request, Response, NextFunction } from "express";
import { isURL } from "validator";
//[GET] "/admin/roles/add"
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    const thumbnail = req.body.thumbnail;
    if(typeof thumbnail === "string"){
        if(!isURL(thumbnail)){
            res.status(400).json({message: "Đường link ảnh không hợp lệ"});
            return;
        }
    }

    next();
}