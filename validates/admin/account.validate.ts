import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Role from "../../models/role.model";
import Account from "../../models/account.model";
import {isEmail, isURL,isMobilePhone} from "validator";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void>  =>{ 

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
}