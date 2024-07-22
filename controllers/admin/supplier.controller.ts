import { Request, Response } from "express";
import { Error } from "mongoose";
import Supplier from "../../models/supplier.model";
//[GET] "/admin/suppliers"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try {
        const suppliers = await Supplier.find({
            deleted: false,
        }) 
        if(suppliers.length === 0){
            res.status(404).json({message: "Không tìm thấy dữ liệu nào"});
            return;
        }
        res.json({suppliers})
    } catch (error) { 
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi truy xuất dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}