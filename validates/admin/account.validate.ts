import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Role from "../../models/role.model";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void>  =>{
    let role_id = req.body.role_id;
    role_id = Types.ObjectId.createFromHexString(role_id)
    if(!await Role.exists({_id: role_id})){
        res.status(404).json({message: "Mã vai trò không tồn tại"});
        return;
    }
    next();
}