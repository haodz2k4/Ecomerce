import { Request, Response } from "express";
import { Error } from "mongoose";
import Role from "../../models/role.model"; 
import { buildFindQuery, buildSorting } from "../../helpers/search.helper";
import { getPagination } from "../../helpers/pagination.helper";
//[GET] "/admin/roles"
export const index = async(req: Request, res: Response) :Promise<void> =>{ 
    const defaultLimit = 6;
    try {
        
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{});
        const counts = await Role.countDocuments(find)
        const pagination = getPagination(req,counts,defaultLimit)
        const roles = await Role.find(find).sort(sort).limit(pagination.limit).skip(pagination.skip);
        if(roles.length === 0){
            res.status(404).json({message: "Không tìm thấy bất kì vai trò nào"});
            return;
        }
        res.json({roles, counts,pagination})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy xuất dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}