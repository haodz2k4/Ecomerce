import { Request, Response } from "express"
import { buildFindQuery, buildSorting, buildSuggestions } from "../../../helpers/search.helper";
import { Error } from "mongoose";
import Product from "../../models/product.model";
import Category from "../../models/category.model";
import { getPagination } from "../../../helpers/pagination.helper";
//[GET] "/search"
export const search = async (req: Request, res: Response) :Promise<void> =>{

    const defaultLimit = 20;
    try { 
        const find = buildFindQuery(req);
        find.status = "active"
        const counts = await Product.countDocuments(find);
        const pagination = getPagination(req,counts,defaultLimit)
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "inventories",
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'inventory'
                }
            },
            {
                $unwind: {
                    path: "$inventory",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $match: find}, {$sort: {position: -1}},
            {
                $addFields: {
                    quantity: {$ifNull: ['$inventory.quantity',0]}
                }
            },
            {
                $project: {title: 1, avatar: 1,price: 1, discountPercentage: 1,slug: 1,position: 1,quantity: 1}
            },
            {
                $skip: pagination.skip,
            },
            {
                $limit: pagination.limit
            }
        ])
        res.json({products, counts, pagination});
    } catch (error) { 
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
    
} 
//[GET] "/search/suggestions"
export const suggestions = async (req: Request, res: Response) :Promise<void> => {
    try {
        const find = buildSuggestions(req);
        find.status = "active"
        const products = await Product.find(find).limit(5).select("title avatar thumbnail")
        res.json({products});
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }

} 