import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Role from "../../../models/role.model";
import Account from "../../../models/account.model";
import {isEmail, isURL,isMobilePhone} from "validator";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void>  =>{ 

    try {
        let role_id = req.body.role_id;
        role_id = Types.ObjectId.createFromHexString(role_id)
        if(!await Role.exists({_id: role_id})){
            res.status(404).json({message: "Mã vai trò không tồn tại"});
            return;
        }  
        //email 
        const email = req.body.email; 
        if(!isEmail(email)){
            res.status(400).json({message: "Email không tồn tại"});
            return;
        }

        if(await Account.exists({email})){
            res.status(400).json({message: "Email đã tồn tại"});
            return;
        }
        //phone 
        const phone = req.body.phone; 
        if(!isMobilePhone(phone,'vi-VN')){
            res.status(400).json({message: "Số điện thoại không hợp lệ"});
            return;
        }
        if(await Account.exists({phone})){
            res.status(400).json({message: "Số điện thoại đã tồn tại"});
            return;
        }
        //avatar 
        const avatar = req.body.avatar;
        if(!isURL(avatar)){
            res.status(400).json({message: "Đường link ảnh không hợp lệ"});
            return;
        } 

        
        next();
    } catch (error) {
        next(error)
    }
}

export const changeRoles = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    try {
        const roleId = Types.ObjectId.createFromHexString(req.body.roleId);
        if(!await Role.exists({_id: roleId})){
            res.status(404).json({message: "Mã vai trò không tồn tại"});
            return;
        }

        next();
    } catch (error) {
        next(error)
    }
} 
export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const types: any[] = [{deleted: true}, {deleted: false}, {status: "active"},{status: "inactive"}] 
    if(!types.includes(req.body.type)){
        res.status(404).json({message: "Thể loại thay đổi không hợp lệ"});
        return;
    }
    next();
}