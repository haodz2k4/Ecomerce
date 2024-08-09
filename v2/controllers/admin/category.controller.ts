import { Request, Response, NextFunction } from "express";
import * as CategoryService from "../../services/category.services";
import { buildFindQuery, buildSorting } from "../../../helpers/search.helper";
import { getPagination } from "../../../helpers/pagination.helper";
//[GET] "/admin/categories"
export const index = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const defaultLimit = 10; 
    try { 
        const find = buildFindQuery(req)
        const sort = buildSorting(req,{createdAt: 'desc'})
        const counts = await CategoryService.getCounts(find)
        const pagination = getPagination(req,counts,defaultLimit)
        const categories = await CategoryService
        .getCategories({find,sort,pagination,select:"-deleted"});
        res.status(200).json({categories, pagination})
    } catch (error) {
        next(error)
    }
}