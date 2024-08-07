import { Request, Response } from "express";
import {Error} from "mongoose"
import ApiError from "../../../utils/ApiError.util";
//service 
import * as ProductService from "../../services/product.services";
import { getPagination } from './../../../helpers/pagination.helper';
//[GET] "/admin/products"
export const index = async (req: Request, res: Response): Promise<void> => {
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
        const counts = await ProductService.GetCounts(find)
        const pagination = getPagination(req,counts,15)
        const products = await ProductService.GetProucts(find,pagination.limit, pagination.skip);

        res.status(200).json({ products, pagination });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({message: "Lỗi Khi Truy vấn csdl"})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
};
