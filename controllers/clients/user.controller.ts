import { Request, Response } from "express";
import { compare } from "bcrypt";
import { Error } from "mongoose";
import {readFile} from "fs-extra";
import path from "path";
import { hash } from "bcrypt";
const templatePath = path.join(__dirname, '..', '..', 'templates', 'otpEmail.html'); 
import jwt from "jsonwebtoken";
//models
import ForgotPassword from "../../models/forgot-password.model";
import User from "../../models/user.model";
//helper
import { sendMessage } from './../../helpers/sendMail.helper';
import { generateRandomNumber } from "../../helpers/generate.helper";
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
//[POST] "/users/password/forgot"
export const forgotPassword = async (req: Request, res: Response) :Promise<void> =>{
    const email = req.body.email; 

    const subject = 'Xác nhận mã OTP của bạn';
    
    try { 
        const otp = generateRandomNumber(6);
        let otpEmailTemplate = await readFile(templatePath, 'utf8');
        otpEmailTemplate = otpEmailTemplate.replace('{{otp}}',otp); 

        const forgotPassword = new ForgotPassword({email, code: otp});
        forgotPassword.save();
        sendMessage(email, subject, otpEmailTemplate);

        res.status(200).json({message: "Email đã được gửi thành công", email, subject})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Lỗi không xác định"})

    }
} 
//[POST] "/users/password/otp"
export const otpPassword = async (req: Request, res: Response) :Promise<void> =>{
    const otp = req.body.otp;
    const email = req.body.email;
    try { 
        const isExists = await ForgotPassword.exists({code: otp, email});
        if(!isExists){
            res.status(404).json({message: "Mã OTP không hợp lệ"});
            return; 
        }  
        const user = await User.findOne({email}).select("email phone");

        const tokenUser = jwt.sign({userId: user?.id},process.env.JWT_SECRET as string,{ expiresIn: '5m' });

        const forgotPassword =await ForgotPassword.deleteOne({email: email})
        res.status(200).json({message: "Xác thực OTP thành công",tokenUser}); 
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn cơ sở dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 
//[GET] "/users/password/reset"
export const resetPassword = async (req: Request, res: Response) :Promise<void> =>{ 

    try {
        if(!req.headers.authorization){
            res.status(400).json({message: "Vui lòng gửi kèm Token"});
            return; 
        } 
    
        const token = req.headers.authorization.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const exsitsUser = await User.findById(decoded.userId); 
        if (!exsitsUser) {
            res.status(404).json({ message: "Người dùng không tồn tại" });
            return;
        } 
        const newPassword = req.body.newPassword;
        const repeatPassword = req.body.repeatPassword;
        if(newPassword !== repeatPassword){
            res.status(400).json({message:"Mật khẩu nhập lại không hợp lệ"});
            return;     
        } 
        const password = await hash(newPassword,10);
        const user = await User.findByIdAndUpdate(exsitsUser.id,{password},{new: true, runValidators: true}).select("-password");
    
        res.status(200).json({message: "Cập nhật mật khẩu thành công", user});
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật mật khẩu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}