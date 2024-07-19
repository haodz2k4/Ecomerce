import { Request, Response } from "express"
import Category from '../../models/category.model';

//helpers
import { getPagination } from "../../helpers/pagination.helper";
export const index = async (req: Request, res: Response) :Promise<void> =>{
    interface Find {
        deleted: boolean,
        status?: string
    }
    const find: Find = {
        deleted: false
    }
    const status = req.query.status;
    if(typeof status === "string" ){
        find.status = status;
    }
    try {
        const count = await Category.countDocuments(find);
        const pagination = getPagination(req, count, 10);
        const categories = await Category.find(find)
        .limit(pagination.limit)
        .skip(pagination.skip)
        res.status(200).json({categories, count, pagination})
    } catch (error) {
        res.status(500).json({message: "Lỗi không xác định"});
    }
}