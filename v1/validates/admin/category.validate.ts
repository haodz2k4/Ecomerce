import { Request, Response, NextFunction } from "express";
import Category from "../../models/category.model";
//validator
import { isValidObjectId } from "mongoose";
import { isURL } from "validator";
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    
    //check parent_category is Exists 
    const parent_category = req.body.parent_category;
    if(isValidObjectId(parent_category)){
        const category = await Category.findById(parent_category);
        if(!category){
            res.status(404).json({message: "Danh mục cha không tồn tại"});
            return;
        }
    }
    const thumbnail = req.body.thumbnail;
    if(!isURL(thumbnail)){
        res.status(400).json({message: "Đường link ảnh không hợp lệ"});
        return;
    }
    next();
}

export const edit = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const parent_category = req.body.parent_category;
    if(isValidObjectId(parent_category)){
        const category = await Category.findById(parent_category);
        if(!category){
            res.status(404).json({message: "Danh mục cha không tồn tại"});
            return;
        }
    }
    const thumbnail = req.body.thumbnail;
    if(!isURL(thumbnail)){
        res.status(400).json({message: "Đường link ảnh không hợp lệ"});
        return;
    }
    next();
}

export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const type = req.params.type;
    //example: 'status-active' 
    const types = ["status-active","status-inactive","deleted-true","position"];
    if(!types.includes(type)){
        res.status(400).json({message: "Loại thay đổi không hợp lệ", validType: types});
        return;
    } 
    next();
}