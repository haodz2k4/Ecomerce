import { Request, Response } from "express"
import Category from '../../models/category.model';

//helpers
import { getPagination } from "../../helpers/pagination.helper";
import { buildFindQuery, buildSorting } from "../../helpers/search.helper";
export const index = async (req: Request, res: Response) :Promise<void> =>{ 
    
    const defaultLimit = 10;
    try { 
        //find 
        const find = buildFindQuery(req); 
        //sorting 
        const sort = buildSorting(req); 
        //total document 
        const counts = await Category.countDocuments(find);
        const pagination = getPagination(req, counts, defaultLimit);
        const categories = await Category.find(find).sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        res.status(200).json({categories, counts, pagination})
    } catch (error) {
        res.status(500).json({message: "Lỗi không xác định"});
    }
}
