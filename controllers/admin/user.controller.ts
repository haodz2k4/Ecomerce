import { Request, Response } from "express";
import { Error } from "mongoose";
import User from "../../models/user.model";
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