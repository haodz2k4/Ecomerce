import { Request, Response } from "express";
import { Error } from "mongoose";
import Product from "../../../models/product.model"; 
import Category from "../../../models/category.model";
import { buildFindQuery, buildSorting } from "../../../helpers/search.helper"; 
import { getPagination } from '../../../helpers/pagination.helper';
// [GET] "/"
export const index = async (req: Request, res: Response) :Promise<void> =>{

   //products: highlighted, bought, new 
    try { 
        
        //hight light products  
        const hightlightedDefaultLimit = 20;
        const sort = buildSorting(req,{position: 'desc'}); 
        const highlightedFind = buildFindQuery(req);
        highlightedFind.highlighted = "1";
        highlightedFind.status = "active"; 
        const highlightedCounts = await Product.countDocuments(highlightedFind);
        const highlightedPagination = getPagination(req,highlightedCounts, hightlightedDefaultLimit);
        const hightlightedProducts = await Product
        .find({highlightedFind})
        .sort(sort)
        .select("title avatar price discountPercentage")
        .limit(highlightedPagination.limit)
        .skip(highlightedPagination.skip); 

        //new product 
        const newDefaultLimit = 10;
        const newFind = buildFindQuery(req);
        newFind.status = "active"; 
        const newCount = await Product.countDocuments(newFind);
        const newPagination = getPagination(req, newCount,newDefaultLimit)
        const newProduct = await Product
        .find(newFind)
        .sort(sort)
        .select("title avatar price discountPercentage")
        .skip(newPagination.skip)
        .limit(newPagination.limit);

        //categories  
        const categories = await Category.find({deleted: false, status: "active"});

        res.status(200).json({hightlightedProducts,highlightedCounts,newProduct,newCount, categories})

        
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }

} 
