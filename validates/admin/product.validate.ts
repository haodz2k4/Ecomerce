import { Request, Response, NextFunction } from "express";
import Category from "../../models/category.model";
import {isValidObjectId, Types} from "mongoose";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    let product_category_id = req.body.product_category_id;
    if(isValidObjectId(product_category_id)){
        product_category_id = Types.ObjectId.createFromHexString(product_category_id);
        if(product_category_id){
            const category = await Category.exists({_id: product_category_id});
            if(!category){
                res.status(404).json({message: "Danh mục không tồn tại"});
                return;
            }
        }
    }
    next();
} 
export const edit = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{ 
    const product_category_id = req.body.product_category_id;
    if(isValidObjectId(product_category_id)){
        const category = await Category.exists({_id: product_category_id});
        if(!category){
            res.status(400).json({message: "Danh mục sản phẩm không hợp lệ"});
            return;
        } else{
            req.body.product_category_id = Types.ObjectId.createFromHexString(product_category_id)
        }
    } 
    next();
}
export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const type = req.params.type;
    const validTypes: string[] = ["status-active","status-inactive","position","deleted-true"];
    if(!validTypes.includes(type)){
        res.status(400).json({message: "Loại thay đổi không hợp lệ"});
        return;
    }

    next();
}