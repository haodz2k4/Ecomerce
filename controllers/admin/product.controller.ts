import { Request, Response } from "express"
import Product from '../../models/product.model';
import {Error} from 'mongoose';
//helpers
import { getPagination } from "../../helpers/pagination.helper";
import { buildFindQuery, buildSorting, buildSuggestions } from "../../helpers/search.helper"; 
import { buildCategoryTree } from "../../helpers/createTree.helper";

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
