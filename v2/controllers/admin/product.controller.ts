import { NextFunction, Request, Response } from "express";
import {Error} from "mongoose"
import ApiError from "../../../utils/ApiError.util";
//service 
import * as ProductService from "../../services/product.services";
import { getPagination } from './../../../helpers/pagination.helper';
//[GET] "/admin/products"
export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { 
        interface Find {
            deleted: boolean,
            status?: string,
            hightlighted?: string,
            title?: RegExp
        }
        const find: Find = {
            deleted: false
        } 
        const keywordQuery = req.query.keyword 
        if (typeof keywordQuery === "string") { 
            const regExp = new RegExp(keywordQuery)
            find.title = regExp
        } 
        const status = req.query.status 
        if(typeof status === 'string'){
            find.status = status
        }
        const counts = await ProductService.getCounts(find)
        const pagination = getPagination(req,counts,15)
        const products = await ProductService.getProucts(find,pagination.limit, pagination.skip);

        res.status(200).json({ products, pagination });
    } catch (error) {
        next(error)
    }
};
//[PATCH] "/admin/products/change/status/:id"
export const changeStatus = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const id = req.params.id 
    const status = req.body.status
    try {
        const product = await ProductService.changeStatus(id, status)

        res.status(200).json({message: "Cập nhật sản phẩm thành công", product})
    } catch (error) {
        next(error)
    }
} 
//[PATCH] "/admin/products/change/multi/:type"
export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const type = req.params.type 
    const ids = req.body.ids
    try {
        switch(type){
            case 'delete': 
                const infoUpdateDelete = await ProductService.changeMultiDelte(ids);
                res.status(200).json({message: "Xóa nhiều sản phẩm thành công", infoUpdateDelete}) 
                break; 
            case 'status': 
                const status = req.body.status 
                const infoUpdateStatus = await ProductService.changeMultiStatus(ids, status)
                res.status(200).json({message: "Thay đổi trạng thái nhiều sản phẩm thành công",infoUpdateStatus})
                break;
            case 'position': 
                
                const products = await ProductService.changeMultiPosition(ids);
                res.status(200).json({message: "Thay đổi vị trí nhiều sản hẩm thành công", products})
                break;
            default: 
            res.json(400).json({message: "Thể loại không hợp lệ"})
        }
    } catch (error) {
        next(error)
    }
}
