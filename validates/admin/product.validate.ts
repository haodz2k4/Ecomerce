import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Product from "../../models/product.model";
import Category from "../../models/category.model.ts";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    const product_category_id = req.body.product_category_id;
    if(isValidObjectId(product_category_id)){
        const category = await Category.findById(product_category_id);
        if(!category){
            res.status(404).json({message: "Danh mục sản phẩm không tồn tại"});
            return;
        }
    }
    next();
}