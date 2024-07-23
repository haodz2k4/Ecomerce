import { Request, Response } from "express"; 
import Account from "../../models/account.model"; 
import { Error } from "mongoose";
//helpers
import { buildFindQuery } from './../../helpers/search.helper';
import { getPagination } from "../../helpers/pagination.helper";
import { buildSorting } from "./../../helpers/search.helper"; 
//[GET] "/admin/accounts"
export const index  = async (req: Request,res: Response) :Promise<void> =>{ 

    const defaultLimit = 10;
    try { 
        const find = buildFindQuery(req);
        const counts = await Account.countDocuments(find);
        const pagination = getPagination(req,counts,defaultLimit);
        const sort = buildSorting(req,{});
        const accounts = await Account.find(find)
        .select("-token -password -deleted")
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort(sort)
        .populate('role_id','title permissions');
        if(accounts.length === 0){
            res.status(404).json({message: "Không tìm thấy bất kỳ tài khoản nào"});
            return;
        }
        res.json({accounts,counts, pagination})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy xuất dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
//[POST] "/admin/accounts/add"
export const add = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    try { 
        const account = new Account(body);
        await account.save();
        res.status(201).json({message: "Thêm tài khoản thành công", account});
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm sản phẩm", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}  
