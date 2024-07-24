import { Request, Response, NextFunction } from "express"
export const createLog = (req: Request, res: Response, next: NextFunction) :void=>{
    const account = res.locals.account;

    req.body.createdBy = account.id
    req.body.updatedBy = account.id

    next();
}