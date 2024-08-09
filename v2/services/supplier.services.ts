
import ApiError from "../../utils/ApiError.util";
import Supplier from "../models/supplier.model";
//interface to find 
import { Find } from "../../helpers/search.helper"
import { Pagination } from "../../helpers/pagination.helper";
//redis 
import redis from "../../config/redis";
//GET LIST SUPPLIER 
export const getSuplliers = async (find: Find, pagination: Pagination, select: string ) => { 
    const cacheKey = `Supplier:${JSON.stringify(find)}:${JSON.stringify(pagination)}:${JSON.stringify(select)}`
    const cachedSupllier = await redis.get(cacheKey)
    if(cachedSupllier){
        return JSON.parse(cachedSupllier)
    }
    const suplliers = await Supplier
    .find(find)
    .limit(pagination.limit)
    .skip(pagination.skip)
    .select(select)
    if(suplliers.length  === 0){
        throw new ApiError(404,"No suppliers found")
    }
    await redis.set(cacheKey,JSON.stringify(suplliers),'EX','3600')
    return suplliers
}
export const getCounts = async (find: Find) => {
    return await Supplier.countDocuments(find)
}