import { Request, Response } from "express"; 

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