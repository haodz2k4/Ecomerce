import { Request, Response } from "express"; 
import Account from "../../models/account.model";
import { Error } from "mongoose";
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
//[PATCH] "/admin/my-account/edit"
export const edit = async (req: Request, res: Response) :Promise<void> =>{ 
    const body = req.body;
    const id = res.locals.account.id
    try {
       const account = await Account.findByIdAndUpdate(id, body,{new: true, runValidators: true});
       if(!account){
        res.status(404).json({message: "Tài khoản không tồn tại"});
        return;
       }
       res.status(200).json({message: "Cập nhật tài khoản thành công", account})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định", error})
        }
    }
}