import { Request, Response } from "express";

import User from "../../models/user.model";
import { Error } from "mongoose";
//[POST] "/users/registers"
export const register = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    try {
        const user = new User(body);
        await user.save();
    
        res.status(201).json({message: "Đăng ký tài khoản thành công", user})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message});
            }else{
                res.status(500).json({message: "Lỗi không thể đăng ký", error: error.message});
            }
        }else{
            res.status(400).json({message: "Lỗi không xác định"});
        }
    }
} 