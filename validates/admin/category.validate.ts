import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Category from "../../models/category.model";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    //check parent_category is Exists 
    const parent_category = req.body.parent_category;
    if(isValidObjectId(parent_category)){
        const category = await Category.findById(parent_category);
        if(!category){
            res.status(400).json({message: "Danh mục cha không tồn tại"});
            return;
        }
    }

    next();
}