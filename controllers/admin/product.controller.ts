import { Request, Response } from "express"
import Product from '../../models/product.model';
import {Error} from 'mongoose';
//helpers
import { getPagination } from "../../helpers/pagination.helper";
import { buildFindQuery, buildSorting, buildSuggestions } from "../../helpers/search.helper"; 
//[GET] "/admin/products"
export const index = async (req: Request, res: Response) :Promise<void> =>{ 
    
    const defaultLimit = 10;
    try { 
        //find 
        const find = buildFindQuery(req); 
        //sorting 
        const sort = buildSorting(req,"position","desc"); 
        //total document 
        const counts = await Product.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const products = await Product.find(find).sort(sort)
        .populate('product_category_id','title thumbnail')
        .limit(pagination.limit)
        .skip(pagination.skip)
        .select("-description -deleted")
        if(products.length === 0){
            res.status(404).json({message: "Không có dữ liệu nào được tìm thấy"});
            return;
        }
        res.status(200).json({products, counts, pagination})
    } catch (error) {
        console.error("Lỗi Không xác định: "+error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi truy xuất dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}
//[POST] "/admin/products/add"
export const add = async (req: Request, res: Response) :Promise<void> =>{

    const body = req.body; 
    try { 

        const position = body.position;
        if(position){
            body.position = parseInt(position);
        }else{
            const total = await Product.countDocuments();
            body.position = total + 1;
        }
        const product = new Product(body);
        await product.save();
        
        res.status(201).json({message: "Thêm sản phẩm thành công", product})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message});
                return;
            }else{
                res.status(500).json({message: "Lỗi không xác định", error: error.message})
            }
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
} 
//[PATCH] "/admin/products/change-status/:status/:id"
export const changeStatus = async (req: Request, res: Response): Promise<void>  =>{
    const status = req.params.status;
    const id = req.params.id;

    try {
        const product = await Product.findByIdAndUpdate(id, {status},{new: true, runValidators: true}).select("status");
        if(!product){
            res.status(404).json({message: "Không tìm thấy sản phẩm có id là: "+id});
            return;
        }
        res.status(200).json({message: "Cập nhật trạng thái thành công",product});
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            if(error.name === 'ValidationError'){
                res.status(400).json({message: "Lỗi xác thực", error: error.message})
            }
        }else{
            res.status(500).json({message:"Lỗi không xác định"})
        }
    }
} 
//[PATCH] "/admin/products/edit/:id" 
export const edit = async (req: Request, res: Response) :Promise<void> =>{ 
    const body = req.body;
    const id = req.params.id; 
    try {
        
        const product = await Product.findByIdAndUpdate(id, body,{new: true, runValidators: true});
        if(!product){
            res.status(404).json({message: "Không tìm thấy sản phẩm có id: "+id});
            return;
        }
        res.status(200).json({message: "Chỉnh sửa thành công", product})
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            if(error.name === "ValidationError"){
                res.status(400).json({message: "Lỗi xác thực", error: error.message});
                return;
            }else{
                res.status(500).json({message: "Lỗi khi chỉnh sửa sản phẩm",error: error.message})
            }
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}
//[PATCH] "/admin/products/soft-delete/:id"
export const softDelete = async (req: Request, res: Response) :Promise<void>  =>{

    const id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(id, {deleted: true},{new: true}).select("deleted");
        if(!product){
            res.status(404).json({message: `Sản phẩm có id: ${id} không tồn tại`});
            return;
        }
        res.status(200).json({message: "Chuyển sản phẩm vào thùng rác thành công",product })
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error});
        }
    }
}
//[GET] "/admin/products/garbages"
export const garbages = async (req: Request, res: Response) :Promise<void>  =>{
    const defaultLimit = 10;
    try {
        const find = buildFindQuery(req);
        find.deleted = true
        const sort = buildSorting(req,"position","desc");
        const counts = await Product.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const products = await Product.find(find).sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip) 
        if(products.length === 0){
            res.status(404).json({message: "Không tìm thấy dữ liệu nào"});
            return;
        }
        res.status(200).json({products,counts, pagination})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không thể truy suất được dữ liệu", error: error.message});

        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
   
}
//[PATCH] "/admin/products/garbages/restore/:id"
export const restore = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;

    try {
        const product = await Product.findByIdAndUpdate(id, {deleted: false},{new: true}).select("deleted");
        if(!product){
            res.status(404).json({message: `Sản phẩm có: ${id} không tồn tại`});
            return;
        }
        res.status(200).json({message: "Khôi phục Sản phẩm thành công", product})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không xác định",error: error.message });
        }else{
            res.status(500).json({message: "Lỗi không xác định",error })
        }
    }
} 
//[PATCH] "/admin/products/garbages/restore/all"
export const restoreAll = async (req: Request, res: Response) :Promise<void>  =>{
    try { 
        const result = await Product.updateMany(
            {deleted: true }, {deleted: false}
        ).select("deleted")

        if(result.modifiedCount === 0){
            res.status(404).json({message: "không có sản phẩm nào khôi phục thành công"});
            return;
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
//[DELETE] "/admin/products/garbages/delete-permanently/:id"
export const deletePermanently = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;

    try {
        const product = await Product.findOne({
            _id: id,
            deleted: true
        })
        if(!product){
            res.status(404).json({message: "Không tìm thấy Sản phẩm hoặc Sản phẩm không nằm trong xóa mềm"});
            return;
        }
        await Product.deleteOne({_id: id})
        res.status(204)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không thể xóa được sản phẩm", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error: error});
        }
    }
}
//[GET] "/admin/products/detail/:id"
export const detail = async (req: Request, res: Response) :Promise<void>  =>{
    const id = req.params.id;

    try {
        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({message: "Không tìm thấy Sản phẩm"});
            return;
        }
        res.status(200).json({message: "Tìm thấy Sản phẩm thành công",product})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi truy xuất dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định", error: error});
        }
    }
}
//[PATCH] "/admin/products/change-multi/:type"
export const changeMulti = async (req: Request, res: Response) :Promise<void> =>{
    const type = req.params.type;
    const ids = req.body;
    const products:any[] = [];
    try { 
        if(type === "position"){
            for(const item of ids){
                const [id, position] = item.split("-");
                
                const product = await Product.findByIdAndUpdate(id, {position},{runValidators: true, new: true}).select(type);
                products.push(product);
            }
            res.status(200).json({message: "Thay đổi vị trí nhiều Sản phẩm thành công",products})
        }else{
            const [key, value] = type.split("-");
            for(const item of ids){
                const product = await Product.findByIdAndUpdate(item, 
                    {[key]: value},
                    {runValidators: true, new: true}).select(key);
                products.push(product)
            }
            
            res.status(200).json({message: "Thay đổi nhiều Sản phẩm thành công", products});
        }
        
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không thể thay đổi sản phẩm", error: error.message})
        }else{
            res.status(500).json({ message: "Lỗi không xác định" });
        }
    }
}
//[GET] "/admin/products/suggestions"
export const suggestions = async (req: Request, res: Response) :Promise<void>  =>{

    const find = buildSuggestions(req); 
    
    let defaultLimit = 10;
    const limit = req.body.limit;
    try { 
        if(limit){ 
            defaultLimit = parseInt(limit);
        }
        const products = await Product.find(find).limit(defaultLimit).select("title avatar price discountPercentage"); 
        const counts = await Product.countDocuments(find)
        if(products.length === 0){
            res.status(404).json({message: "Không tìm thấy gợi ý nào"});
            return;
        }
        res.status(200).json({products, counts})
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Không thể tìm thấy gợi ý", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 