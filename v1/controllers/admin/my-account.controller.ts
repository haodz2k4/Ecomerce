import { Request, Response } from "express"; 
import Account from "../../../models/account.model";
import { Error } from "mongoose";
import { compare } from "bcrypt";
import { hash } from "bcrypt";
declare module 'express-session' {
    interface SessionData {
      isPasswordConfirmed?: boolean;
    }
  }
//[GET] "/admin/my-account"
export const index = async (req: Request, res: Response) :Promise<void> =>{
    try {
        const account = res.locals.account;
        res.status(200).json({account});
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Lỗi không xác định"});
    }
}
//[PATCH] "/admin/my-account/edit"
export const edit = async (req: Request, res: Response) :Promise<void> =>{ 
    const body = req.body;
    const id = res.locals.account.id
    try {
       const account = await Account.findByIdAndUpdate(id, body,{new: true, runValidators: true});
       if(!account){
        res.status(404).json({message: "Tài khoản không tồn tại"});
        return;
       }
       res.status(200).json({message: "Cập nhật tài khoản thành công", account})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định", error})
        }
    }
}
//[POST] "/admin/my-account/confirm-password"
export const confirmPassword = async (req: Request, res: Response) :Promise<void> =>{
    const password = req.body.password; 
    const account = res.locals.account;

    try {
        if(!await compare(password, account?.password)){
            res.status(200).json({message: "Mật khẩu không khớp"});
            return;
        } 
        
        req.session.isPasswordConfirmed = true;
        res.status(200).json({message: "Mật khẩu trùng khớp", account})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn csdl", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}
//[POST] "/admin/my-account/reset-password"
export const resetPassword = async (req: Request, res: Response) :Promise<void> =>{


    if(!req.session.isPasswordConfirmed){
        res.status(401).json({message: "Bạn chưa điền xác thực mật khẩu"});
        return; 
    } 
    const id = res.locals.account.id;
    const password = req.body.password;
    const repeatPassword = req.body.repeatPassword;
    try {
        if(password !== repeatPassword){
            res.status(400).json({message: 'Mật khẩu xác nhận không đúng'});
            return;
        } 
        const hashPassword = await hash(password,10);
        const account = await Account.findByIdAndUpdate(id,{password: hashPassword}, {new: true, runValidators: true}).select("fullName password"); 

        if(req.session){
            delete req.session.isPasswordConfirmed;
        }
        res.status(200).json({message: "Cập nhật mật khẩu thành công", account});
    } catch (error) { 
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật mật khẩu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật mật khẩu"})
        }
    }
} 