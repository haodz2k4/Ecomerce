import { Request, Response } from "express";
import Point from "../../../models/point.model";
import { buildFindQuery, buildSorting } from '../../../helpers/search.helper';
import { getPagination } from '../../../helpers/pagination.helper';
import { Error } from "mongoose";
//[GET] "/admin/points"
export const index = async (req: Request, res: Response) :Promise<void> =>{
    const defaultLimit = 15;
    try { 
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{createdAt: 'desc'}); 
        const counts = await Point.countDocuments(find);
        const pagination = getPagination(req,counts,defaultLimit);
        const points = await Point
        .find(find)
        .populate('user_id','fullName avatar email')
        .populate('source','-deleted')
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip);
        if(points.length === 0){
            res.status(404).json({message: "Không tìm thấy điểm tích lũy nào hết"});
            return; 
        }
    
        res.json({points})
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn csdl", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}