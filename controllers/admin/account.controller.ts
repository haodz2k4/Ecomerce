import { Request, Response } from "express"; 
import Account from "../../models/account.model"; 
import { Error, isObjectIdOrHexString } from "mongoose";
import { Types } from "mongoose";
import Role from "../../models/role.model";
//helpers
import { buildFindQuery } from './../../helpers/search.helper';
import { getPagination } from "../../helpers/pagination.helper";
import { buildSorting } from "./../../helpers/search.helper"; 
//[GET] "/admin/accounts"
export const index  = async (req: Request,res: Response) :Promise<void> =>{ 

    const defaultLimit = 10;
    try { 
        const find = buildFindQuery(req,'fullName');
        const counts = await Account.countDocuments(find);
        const pagination = getPagination(req,counts,defaultLimit);
        const sort = buildSorting(req,{});
        const accounts = await Account.find(find)
        .select("-token -password -deleted")
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort(sort)
        .populate('role_id','title permissions')
        .populate('createdBy','fullName avatar email');
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

        await account.populate('role_id', 'title');
        await account.populate('createdBy', 'fullName email');
        res.status(201).json({message: "Thêm tài khoản thành công", account});
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm sản phẩm", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }   
}  
//[PATCH] "/admin/accounts/change/roles"
export const changeRoles = async (req: Request, res: Response) :Promise<void> =>{
    try { 
        const roleId = Types.ObjectId.createFromHexString(req.body.roleId);
        const accountId = req.body.accountId;
        const updatedBy = req.body.updatedBy;
        const account = await Account.findByIdAndUpdate(accountId,{role_id: roleId, updatedBy: updatedBy}, {new: true, runValidators: true})
        .populate('role_id','title avatar permissions')
        .populate('updatedBy','fullName email')
        .select("fullName email role_id updatedBy");
        if(!account){
            res.status(404).json({message: "Không tìm thấy tài khoản tương ứng"});
            return;
        }

        res.status(200).json({account})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Không thể thay đổi vai trò", error: error.message});
        }else{
            res.status(500).json({message: "lỗi không xác định"});
        }
    }
    
} 
//[PATCH] "/admin/accounts/change/status"
export const changeStatus = async (req: Request, res: Response) :Promise<void> =>{ 
    const status = req.body.status;
    const id = req.body.id;
    try {
        const account = await Account.findByIdAndUpdate(id, {status},{new: true, runValidators: true}).select("status");
        if(!account){
            res.status(404).json({message:"Tài khoản không tìm thấy"});
            return; 
        } 
        res.status(200).json({message: "Cập nhật trạng thái tài khoản thành công", account})

    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật sản phẩm", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})   
        }
    }
}
//[PATCH] "/admin/accounts/change/multi"
export const changeMulti = async (req: Request, res: Response) :Promise<void> =>{
    const ids = req.body.ids;
    const type = req.body.type;
    try {
        const infoUpdate = await Account.updateMany(
            {_id: {$in: ids}},{...type});

        if(infoUpdate.modifiedCount === 0){
            res.status(404).json({message:"Không có sản phẩm nào cập nhật"});
            return;
        }

        res.status(200).json({message: "Thay đổi nhiều tài khoản thành công", infoUpdate})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}