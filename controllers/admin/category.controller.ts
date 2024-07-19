import { Request, Response } from "express"
import Category from '../../models/category.model';
import {Error} from 'mongoose';
//helpers
import { getPagination } from "../../helpers/pagination.helper";
import { buildFindQuery, buildSorting } from "../../helpers/search.helper"; 

//[GET] "/admin/categories"
export const index = async (req: Request, res: Response) :Promise<void> =>{ 
    
    const defaultLimit = 10;
    try { 
        //find 
        const find = buildFindQuery(req); 
        //sorting 
        const sort = buildSorting(req); 
        //total document 
        const counts = await Category.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const categories = await Category.find(find).sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        res.status(200).json({categories, counts, pagination})
    } catch (error) {
        res.status(500).json({message: "Lỗi không xác định"});
    }
}
//[PATCH] "/admin/categories/change-status/:status/:id"
export const changeStatus = async (req: Request, res: Response) :Promise<void> =>{
    const status = req.params.status;
    const id = req.params.id; 
    try {
        const category = await Category.findByIdAndUpdate(id,{status}, {new: true, runValidators: true}).select("status");
        if(!category){
            res.status(404).json({message: `Danh mục có id: ${id} không hợp lệ`});
            return;
        }
        res.status(200).json({ message: "Cập nhật danh mục thành công", category})
    } catch (error) {
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message});
            }
            res.status(500).json({message: "Lỗi không xác định", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 
//[POST] "/admin/categories/add"
export const add = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    try {
        const category = new Category(body);
        await category.save();
        res.status(200).json({message: "Thêm danh mục thành công", category})
    } catch (error) { 
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: "Lỗi xác thực", error: error.message });
                return;
            }
            res.status(500).json({ message: "Lỗi không xác định", error: error.message });
        } else {
            res.status(500).json({ message: "Lỗi không xác định" });
        }

    }
}  
//[PATCH] "/admin/categories/edit/:id"
export const edit = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    const id = req.params.id;
    try {
        const category = await Category.findByIdAndUpdate(id, body,{ runValidators: true, new: true },);
        res.status(200).json({message: "Chỉnh sửa thành công", category})
    } catch (error) {
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message})
            }else{
                res.status(500).json({message: "Lỗi không xác định", error: error.message})
            }
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}
//[PATCH] "/admin/categories/soft-delete/:id"
export const softDelete = async (req: Request, res: Response) :Promise<void>  =>{

    const id = req.params.id;
    try {
        const category = await Category.findByIdAndUpdate(id, {deleted: true},{new: true}).select("deleted");
        if(!category){
            res.status(404).json({message: `Danh mục có id: ${id} không tồn tại`});
            return;
        }
        res.status(200).json({message: "Cập nhật danh mục thành công",category })
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}