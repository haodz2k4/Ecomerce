import { Request, Response } from "express"
import Category from '../../models/category.model';

//helpers
import { getPagination } from "../../helpers/pagination.helper";
import { buildFindQuery } from "../../helpers/search.helper";
export const index = async (req: Request, res: Response) :Promise<void> =>{ 
    
    try { 

        const find = buildFindQuery(req);
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