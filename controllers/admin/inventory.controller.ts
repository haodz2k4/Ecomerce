import { Request, Response } from "express";
import {Error} from "mongoose";
import Inventory from "../../models/inventory.model";
//helper 
import { buildFindQuery, buildSorting } from './../../helpers/search.helper';
//[GET] "/admin/inventories"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try { 

        const inventories = await Inventory.find({
            deleted: false
        }).populate({
            path: 'product_id',
            select: 'title avatar price discountPercentage',
            match: {deleted: false,_id: {$ne: null}}
        })
        if(inventories.length === 0){
            res.status(404).json({message: "Không có sản phẩm nào được tìm thấy"});
            return;
        }
        res.status(200).json({inventories})

    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy suất dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}