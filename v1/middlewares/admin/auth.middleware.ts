import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import Account from "../../../models/account.model"; 
import jwt from "jsonwebtoken";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{

    try {
        if(!req.headers.authorization){
            res.status(401).json({message: "Vui lòng gửi kèm token"});
            return;
        } 
        const token = req.headers.authorization.split(" ")[1]; 
        const encode: any = jwt.verify(token,process.env.JWT_SECRET as string); 

        const account = await Account.findOne({
            deleted: false,
            _id: encode.accountId 
        }).populate('role_id')
    
        if(!account){
            res.status(401).json({message: "Token không tồn tại"});
            return;
        } 
        res.locals.account = account
        next();
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi Khi Thực hiện truy vấn", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}  
export const requirePermission = (name: string) =>{ 

    
    return async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
        const account = res.locals.account;
        const permission = account.role_id.permissions;
        if(!permission.includes(name)){
            res.status(403).json({message: "Bạn không nhóm quyền tương ứng"});
            return;
        } 

        next();
    }
}