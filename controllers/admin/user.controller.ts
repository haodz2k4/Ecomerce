import { Request, Response } from "express";
import { Error } from "mongoose";
//model
import User from "../../models/user.model";
import Address from "../../models/address.model"
//helper
import { buildFindQuery,buildSorting } from './../../helpers/search.helper';
import { getPagination } from './../../helpers/pagination.helper';
//[GET] "/admin/users" 
export const index = async  (req: Request, res: Response) :Promise<void> =>{

    try {
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{createdAt: "desc"});
        const counts = await User.countDocuments(find)
        const pagination = getPagination(req,counts,15)
        const users = await User.find(find)
        .sort(sort)
        .select("fullName avatar email phone status createdAt gender")
        .skip(pagination.skip)
        .limit(pagination.limit);
        
        res.json({users,counts, pagination})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn database", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu"})
        }
    }
}   
//[GET] "/admin/users/detail/:id"
export const detail = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;
    
    try {
         const user = await User.findById(id);
         if(!user){
            res.status(404).json({message: "Không tìm thấy người dùng tương ứng"});
            return;
         }
         const address = await Address.find({user_id: id});
         res.status(200).json({user, address});
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn database", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu"})
        }
    }
}