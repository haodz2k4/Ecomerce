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
