import { Request, Response, NextFunction } from "express";
import { isEmail, isMobilePhone } from "validator";
export const login =  (req: Request, res: Response, next: NextFunction) :void =>{
    const identifier = req.body.identifier;

    if (!identifier) {
        res.status(400).json({ message: "Mã định không được bỏ trống"});
        return;
    } 
    const password = req.body.password; 
    if(!password){
        res.status(400).json({message: "password không được để trống"});
        return;
    }
    if(typeof identifier === 'string'){
        if(isEmail(identifier)){
            res.locals.identifier = {email: identifier};
        }else if (isMobilePhone(identifier)){
            res.locals.identifier = {phone: identifier};

        }else{
            res.status(400).json({message: "Mã Định danh không hợp lệ"});
            return;
        }
    }else{
        res.status(400).json({message: "Loại định danh không hợp lệ"});
        return;
    } 

    next();
}