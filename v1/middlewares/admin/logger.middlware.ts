import { Request, Response, NextFunction } from "express";
export const createLog = (type: string) =>{
    return (req: Request, res: Response, next: NextFunction) =>{ 
        const account = res.locals.account;
        switch(type){
            case "create": 
                req.body.createdBy = account.id;
                break;
            case "update":
                req.body.updatedBy = account.id;
                break; 
            case "delete":
                req.body.deletedBy = account.id 
                break;
            default:
                res.status(404).json({message: "Loại log không hợp lệ"});
                return;
        }


        next();
    }
} 
