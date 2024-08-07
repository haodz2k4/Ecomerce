import { Request, Response, NextFunction } from "express";
import Category from "../../models/category.model";
import ApiError from "../../../utils/ApiError.util";
import {isURL} from "validator";
export const edit = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const categoryId = req.body.category_id 
        if(typeof categoryId === "string"){
            const exists = await Category.exists({_id: categoryId})
            if(!exists){
                throw new ApiError(404,"Danh mục không tồn tại")
            }
        } 
        const thumbnail = req.body.thumbnail;
        if(typeof thumbnail === "string"){
            if(!isURL(thumbnail)){
                throw new ApiError(400,"Đường link ảnh không hợp lệ")
            }
        } 


        next()
    } catch (error) {
        next(error)
    }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const categoryId = req.body.category_id 
        if(typeof categoryId === "string"){
            const exists = await Category.exists({_id: categoryId})
            if(!exists){
                throw new ApiError(400,"Danh mục không tồn tại")
            }
        } 
        const thumbnail = req.body.thumbnail;
        if(typeof thumbnail === "string"){
            if(!isURL(thumbnail)){
                throw new ApiError(400,"Đường link ảnh không hợp lệ")
            }
        } 


        next()
    } catch (error) {
        next(error)
    }
}
export const changeCategory = async (req: Request, res: Response, next: NextFunction) =>{

    
    const categoryId = req.body.category_id 
    if(typeof categoryId === "string"){
        const exists = await Category.exists({_id: categoryId})
        if(!exists){
            throw new ApiError(400,"Danh mục không tồn tại")
        }
    } 
    next()
} 