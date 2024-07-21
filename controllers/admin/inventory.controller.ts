import { Request, Response } from "express";
import {Error} from "mongoose";
import Inventory from "../../models/inventory.model";
//helper 
import { buildFindQuery, buildSorting } from './../../helpers/search.helper';
//[GET] "/admin/inventories"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try { 
        const find = buildFindQuery(req);
        const sort = buildSorting(req,'position','desc');
        const inventories = await Inventory.find({
            deleted: false
        }).populate({
            path: 'product_id',
            select: '-description -deleted',
            match: find,
            options: {sort}
        })
        if(inventories.length === 0){
            res.status(404).json({message: "Không có sản phẩm nào được tìm thấy"});
            return;
        }
        res.json({inventories})

    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy suất dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
//[PATCH] "/admin/inventories/update"
export const update = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    try {
        const inventories: any[] = [];

        for(const item of body){
            const id = item.id;
            const quantity = parseInt(item.quantiy); 
            const inventory = await Inventory.findById(id).select("quantity"); 
            if(!inventory){
                res.status(404).json({message: "Không tìm thấy id: "+ item.id});
                return;
            }
            const result = inventory.quantity + quantity; 
            inventory.quantity = result;

            await inventory.save();

            inventories.push(inventory  );
        }
        res.status(200).json({message: "Cập nhật thành công",inventories })
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}   

