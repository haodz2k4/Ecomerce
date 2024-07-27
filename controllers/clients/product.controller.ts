import { getPagination } from './../../helpers/pagination.helper';
import { buildFindQuery, buildSorting } from './../../helpers/search.helper';
import { Request, Response } from "express";
import Product from "../../models/product.model";
import { Error } from "mongoose";
//[GET] "/products"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try {

        const find = buildFindQuery(req);
        find.status = "active"; 
        const counts = await Product.countDocuments(find);
        const pagination = getPagination(req, counts, 30);
       
        const products = await Product.aggregate([
            {
                $match: find
            },
            {
                $lookup: {
                    from: "inventories",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "inventory"
                }
            },
            {
                $unwind: {
                    path: "$inventory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    quantity: { $ifNull: ["$inventory.quantity", 0] }
                }
            },
            {
                $project: {
                    title: 1,
                    price: 1,
                    discountPercentage: 1,
                    avatar: 1,
                    quantity: 1,
                    position: 1
                }
            },
            {
                $limit: pagination.limit
            },
            {
                $skip: pagination.skip
            },
            {
                $sort: {
                    position: -1
                }
            }
        ]);
        
        res.status(200).json({products});
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn cơ sở dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}