import { Request, Response } from "express"
import Category from '../../../models/category.model';
import {Error} from 'mongoose';
//helpers
import { getPagination } from "../../../helpers/pagination.helper";
import { buildFindQuery, buildSorting, buildSuggestions } from "../../../helpers/search.helper"; 
import { buildCategoryTree } from "../../../helpers/createTree.helper";

//[GET] "/admin/categories"
export const index = async (req: Request, res: Response) :Promise<void> =>{ 
    
    const defaultLimit = 10;
    try { 
        //find 
        const find = buildFindQuery(req); 
        //sorting 
        const sort = buildSorting(req,{position: 'desc'}); 
        //total document 
        const counts = await Category.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const categories = await Category.find(find).sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip) 
        if(categories.length === 0){
            res.status(404).json({message: "Không có dữ liệu nào được tìm thấy"});
            return;
        }
        res.status(200).json({categories, counts, pagination})
    } catch (error) {
        res.status(500).json({message: "Lỗi không xác định", error});
    }
}
//[PATCH] "/admin/categories/change-status/:status/:id"
export const changeStatus = async (req: Request, res: Response) :Promise<void> =>{
    const status = req.params.status;
    const id = req.params.id; 
    const updatedBy = req.body.updatedBy;
    try {
        const category = await Category.findByIdAndUpdate(id,{status,updatedBy}, {new: true, runValidators: true}).select("status updatedBy");
        if(!category){
            res.status(404).json({message: `Danh mục có id: ${id} không hợp lệ`});
            return;
        }
        res.status(200).json({ message: "Cập nhật danh mục thành công", category})
    } catch (error) {
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message});
                return;
            }
            res.status(500).json({message: "Lỗi không xác định", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định", error});
        }
    }
} 
//[POST] "/admin/categories/add"
export const add = async (req: Request, res: Response) :Promise<void> =>{
    const body = req.body;
    try {
        if(body.position){
            body.position = parseInt(body.position)
        }else{ 
            body.position = await Category.countDocuments();
        }
        const category = new Category(body);
        await category.save();
        res.status(201).json({message: "Thêm danh mục thành công", category})
    } catch (error) { 
        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: "Lỗi xác thực", error: error.message });
                return;
            }
            res.status(500).json({ message: "Lỗi không xác định", error: error.message });
        } else {
            res.status(500).json({ message: "Lỗi không xác định", error });
        }

    }
}  
//[GET] "/admin/categories/create-tree"
export const createTree = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find({
            deleted: false,
            status: "active"
        }).select("title thumbnail position parent_category");
        if(categories.length === 0){
            res.status(404).json({message: "Không có danh mục nào"});
            return;
        }
        const categoryTree = buildCategoryTree(categories);
        res.status(200).json({ categoryTree });
    } catch (error) {
        console.error(error)
        if(error instanceof Error){ 
            res.status(500).json({message: "Không thể truy xuất dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
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
            res.status(500).json({message: "Lỗi không xác định", error})
        }
    }
}
//[PATCH] "/admin/categories/soft-delete/:id"
export const softDelete = async (req: Request, res: Response) :Promise<void>  =>{

    const id = req.params.id;
    const updatedBy = req.body.updatedBy
    try {
        const category = await Category.findByIdAndUpdate(id, {deleted: true,updatedBy},{new: true}).select("deleted updatedBy");
        if(!category){
            res.status(404).json({message: `Danh mục có id: ${id} không tồn tại`});
            return;
        }
        res.status(200).json({message: "Cập nhật danh mục thành công",category })
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error});
        }
    }
}
//[GET] "/admin/categories/garbages"
export const garbages = async (req: Request, res: Response) :Promise<void>  =>{
    const defaultLimit = 10;
    try {
        const find = buildFindQuery(req);
        find.deleted = true
        const sort = buildSorting(req,{position: 'desc'});
        const counts = await Category.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const categories = await Category.find(find).sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip) 
        if(categories.length === 0){
            res.status(404).json({message: "Không tìm thấy dữ liệu nào"});
            return;
        }
        res.status(200).json({categories,counts, pagination})
    } catch (error) {
       res.status(500).json({message: "Lỗi không xác định", error});
    }
   
}
//[PATCH] "/admin/categories/garbages/restore/:id"
export const restore = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;
    const updatedBy = req.body.updatedBy;
    try {

        updatedBy 
        const category = await Category.findByIdAndUpdate(id, {deleted: false, updatedBy},{new: true}).select("deleted");
        if(!category){
            res.status(404).json({message: `Danh mục có: ${id} không tồn tại`});
            return;
        }
        res.status(200).json({message: "Khôi phục danh mục thành công", category})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định",error: error.message });
        }else{
            res.status(500).json({message: "Lỗi không xác định",error })
        }
    }
} 
//[PATCH] "/admin/categories/garbages/restore/all"
export const restoreAll = async (req: Request, res: Response) :Promise<void>  =>{

    const updatedBy = req.body.updatedBy; 
    try { 
        const result = await Category.updateMany(
            {deleted: true }, {deleted: false, updatedBy}
        ).select("deleted")

        if(result.modifiedCount === 0){
            res.status(404).json({message: "không có sản phẩm nào khôi phục thành công"})
        }
        res.status(200).json({message: "Khôi phục toàn bộ sản phẩm thành công",modifiedCount: result.modifiedCount })
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error: error})
        }
    }
}
//[DELETE] "/admin/categories/garbages/delete-permanently/:id"
export const deletePermanently = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;

    try {
        const category = await Category.findOne({
            _id: id,
            deleted: true
        })
        if(!category){
            res.status(404).json({message: "Không tìm thấy danh mục hoặc danh mục không nằm trong xóa mềm"});
            return;
        }
        await Category.deleteOne({_id: id})
        res.status(204).json({message: "Xóa vĩnh viễn thành công",category})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error: error});
        }
    }
}
//[GET] "/admin/categories/detail/:id"
export const detail = async (req: Request, res: Response) :Promise<void>  =>{
    const id = req.params.id;

    try {
        const category = await Category.findById(id);
        if(!category){
            res.status(404).json({message: "Không tìm thấy danh mục"});
            return;
        }
        res.status(200).json({message: "Tìm thấy danh mục thành công",category})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error: error});
        }
    }
}
//[PATCH] "/admin/categories/change-multi/:type"
export const changeMulti = async (req: Request, res: Response) :Promise<void> =>{
    const type = req.params.type;
    const ids = req.body;
    const createdBy = req.body.createdBy;
    const categories:any[] = [];
    try { 
        if(type === "position"){
            for(const item of ids){
                const [id, position] = item.split("-");
                
                const category = await Category.findByIdAndUpdate(id, {position, createdBy},{runValidators: true, new: true}).select(type);
                categories.push(category);
            }
            res.status(200).json({message: "Thay đổi vị trí nhiều danh mục thành công",categories})
        }else{
            const [key, value] = type.split("-");
            for(const item of ids){
                const category = await Category.findByIdAndUpdate(item, 
                    {[key]: value},
                    {runValidators: true, new: true}).select(key);
                categories.push(category)
            }
            
            res.status(200).json({message: "Thay đổi nhiều danh mục thành công", categories});
        }
        
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({ message: "Lỗi không xác định" });
        }
    }
}
//[GET] "/admin/categories/suggestions"
export const suggestions = async (req: Request, res: Response) :Promise<void>  =>{

    const find = buildSuggestions(req);
    try {
        const categories = await Category.find(find); 
        if(categories.length === 0){
            res.status(404).json({message: "Không tìm thấy gợi ý nào"});
            return;
        }
        res.status(200).json({categories})
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Không thể tìm thấy gợi ý", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 