import { Request, Response, NextFunction } from "express";
import {isURL,isEmail} from "validator"
export const edit = (req: Request, res: Response,next: NextFunction) :void =>{
    const account = res.locals.account;
    const avatar = req.body.avatar; 
    if(typeof avatar === "string"){
        if(!isURL(avatar)){
            res.status(400).json({message: "Định dạng avatar không hợp lệ"});
            return;
        }
    } 

    const email = req.body.email;
    if(typeof email === 'string'){
        if(!isEmail(email)){
            res.status(400).json({message: "Định dạng email không hợp lệ"});
            return;
        }
    } 
    const validEditRole = 'role_edit';
    const permissions = account.role_id.permissions;
    const role_id = req.body.role_id;
    if(typeof role_id === 'string'){
        if(!permissions.includes(validEditRole)){
            res.status(403).json({message: "Bạn không có đủ thẩm quyền để chỉnh sửa vai trò"});
            return;
        }
    }



    next();
    
}