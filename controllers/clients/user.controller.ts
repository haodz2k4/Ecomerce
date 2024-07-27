import { Request, Response } from "express";
import { compare } from "bcrypt";
import User from "../../models/user.model";
import { Error } from "mongoose";
import {readFile} from "fs-extra";
import path from "path";
const templatePath = path.join(__dirname, '..', '..', 'templates', 'otpEmail.html');
import { generateRandomNumber } from "../../helpers/generate.helper";
//helper
import { sendMessage } from './../../helpers/sendMail.helper';
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
//[POST] "/users/login"
export const login = async (req: Request, res: Response) :Promise<void> =>{
    const password = req.body.password;
    const infoLogin = res.locals.infoLogin;
    try { 
        

        const user = await User.findOne(infoLogin).select("fullName avatar email phone token password");
        if(!user){
            res.status(401).json({message: "Tài khoản không tồn tại"});
            return;
        }
        const isComparePassword = await compare(password,user.password);
        if(!isComparePassword){
            res.status(401).json({message: "Mật khẩu không đúng"});
            return; 
        }
    
        res.status(200).json({message: "Đăng nhập thành công", user})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Lỗi không xác định"})
    }
} 
//[POST] "/users/forgot/password"
export const forgotPassword = async (req: Request, res: Response) :Promise<void> =>{
    const email = req.body.email; 

    const subject = 'Xác nhận mã OTP của bạn';
    
    try { 

        const otp = generateRandomNumber(6);
        let otpEmailTemplate = await readFile(templatePath, 'utf8');
        otpEmailTemplate = otpEmailTemplate.replace('{{otp}}',otp);
        sendMessage(email, subject, otpEmailTemplate);

        res.status(200).json({message: "Email đã được gửi thành công", email, subject})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Lỗi không xác định"})

    }
}