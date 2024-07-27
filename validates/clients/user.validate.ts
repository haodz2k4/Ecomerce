import { Request, Response, NextFunction } from "express";
import {isEmail, isMobilePhone, isURL} from "validator";
import { isValidBirthDate } from './../../utils/date.utils';
export const register = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{

    const email = req.body.email
    if(typeof email === 'string'){
        if(!isEmail){
            res.status(400).json({message: "Định dạng email không hợp lệ"});
            return;
        }
    }
    const phone = req.body.phone;
    if(typeof phone === 'string'){
        if(!isMobilePhone(phone)){
            res.status(400).json({message: "định dạng số điện thoại không hợp lệ"});
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