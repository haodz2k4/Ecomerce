import { Request, Response } from "express";
import Order from "../../models/order.model";
import { buildFindQuery, buildSorting } from './../../helpers/search.helper';
import { getPagination } from './../../helpers/pagination.helper';
import { Error } from "mongoose";
//[GET] "/admin/orders"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try {
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{createdAt: 'desc'});
        const counts = await Order.countDocuments(find);
        const pagination = getPagination(req,counts, 15);
        const orders = await Order
        .find(find)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('user_id','fullName avatar')
        .populate('address_id','city street district')
        if(orders.length === 0){
            res.status(404).json({message: "Không có hóa đơn nào"});
            return;
        }    
        res.status(200).json({orders})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi trong truy vấn cơ sỡ dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 