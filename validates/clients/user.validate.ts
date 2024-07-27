import { Request, Response, NextFunction } from "express";
import {isEmail, isMobilePhone, isURL} from "validator";
import { isValidBirthDate } from './../../utils/date.utils'; 

import User from '../../models/user.model';
interface infoLogin {
    email?: string,
    phone?: string
}

export const register = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{

    const email = req.body.email
    if(typeof email === 'string'){
        if(!isEmail){
            res.status(400).json({message: "Định dạng email không hợp lệ"});
            return;
        } 
        const isExists = await User.exists({email});
        if(isExists){
            res.status(400).json({message: "Email đã tồn tại"});
            return;
        }
    }
    const phone = req.body.phone;
    if(typeof phone === 'string'){
        if(!isMobilePhone(phone)){
            res.status(400).json({message: "định dạng số điện thoại không hợp lệ"});
            return;
        }
        const isExists = await User.exists({phone});
        if(isExists){
            res.status(400).json({message: "Số điện thoại đã tồn tại"});
            return;
        }
    } 
    const date = req.body.date;
    if(typeof date === 'string'){
        if(!isValidBirthDate){
            res.status(400).json({message: "Năm sinh không hợp lệ"});
            return;
        }
    }
    next();
}

export const login = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    const identifier = req.body.identifier;
    if(!identifier){
        res.status(400).json({message: "Vui lòng gửi mã định danh"});
        return;
    }
    const infoLogin:infoLogin = {}
    if(isEmail(identifier)){
        infoLogin.email = identifier;
    }else if (isMobilePhone(identifier)){
        infoLogin.phone = identifier;
    }else{
        res.status(400).json({message: "Định danh không hợp lệ"});
        return;
    }
    res.locals.infoLogin = infoLogin;
    next();
}