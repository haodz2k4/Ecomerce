import { getPagination } from './../../../helpers/pagination.helper';
import { NextFunction, Request, Response } from "express";
import { buildFindQuery } from './../../../helpers/search.helper';
import * as SupplierService from "../../services/supplier.services"
//[GET] "/admin/suppliers"
export const index = async (req: Request,res: Response, next: NextFunction) :Promise<void> => {
    try {
        const defaultLimit = 10
        const find = buildFindQuery(req,"name")
        const counts = await SupplierService.getCounts(find)
        const pagination = getPagination(req,counts,defaultLimit)
        const suppliers = await SupplierService.getSuplliers(find,pagination,"-deleted")
        res.status(200).json({suppliers, pagination})
    } catch (error) {
        next(error)
    }
} 