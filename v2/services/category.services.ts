import Category from "../models/category.model";
import { Filter, Find } from "../../helpers/search.helper";
import ApiError from "../../utils/ApiError.util";
import redis from "../../config/redis";
//GET LIST CATEGORIES 
export const getCategories = async (ft: Filter) => {

    const cacheKey = `categories:${JSON.stringify(ft.find)}
    :${JSON.stringify(ft.sort)}
    :${JSON.stringify(ft.pagination.skip)}
    :${JSON.stringify(ft.pagination.limit)}`
    const cachedCategory = await redis.get(cacheKey)
    if(cachedCategory){
        return JSON.parse(cachedCategory)
    }
    const categories = await Category
    .find(ft.find)
    .sort(ft.sort)
    .skip(ft.pagination.skip)
    .limit(ft.pagination.limit)
    .select(ft.select as string) 
    if(categories.length == 0){
        throw new ApiError(404,"Không có danh mục nào hết")
    }
    await redis.set(cacheKey,JSON.stringify(categories),'EX',1800)
    return categories
}
//GET COUNTS 
export const getCounts = async (find: Find) => {
    return await Category.countDocuments(find)
} 
