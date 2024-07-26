import { Request, Response, NextFunction } from "express";
import { isURL, isEmail, isMobilePhone } from "validator";
export const editGeneral = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{

    const logo = req.body.logo;
    if(typeof logo === 'string'){
        if(!isURL(logo)){
            res.status(400).json({message: "Đường dẫn logo không hợp lệ"});
            return;
        }
    }

    const phone = req.body.phone;
    if(!isMobilePhone(phone)){
        res.status(400).json({message: "Định Dạng số điện thoại không hợp lệ"});
        return;
    }
    const email = req.body.email;
    if(!isEmail(email)){
        res.status(400).json({message: "Định dạng email không hợp lệ"});
        return;
    }

    next();
}