
import { Request, Response } from "express"; 
import { isEmail, isMobilePhone } from "validator";
import { Error } from "mongoose";
import Account from "../../models/account.model";
import bcrypt from "bcrypt";
//[POST] "/admin/auth/login"
export const login = async (req: Request, res: Response) :Promise<void> =>{

    const password = req.body.password; 
    const identifier = res.locals.identifier;
    try {
        const account = await Account.findOne(identifier).select("token password");
        if(!account){
            res.status(404).json({message: "Tài khoản không tồn tại"});
            return;
        } 
        const isComparePassword = await bcrypt.compare(password, account.password);
        if(!isComparePassword){
            res.status(404).json({message: "Mật Khẩu không tồn tại"});
            return;
        }
        res.status(200).json({message: "Đăng Nhập Thành Công", account})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi xác định"});
        }
    }
    
}