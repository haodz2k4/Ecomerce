import Category from "../models/category.model";
import Product from "../models/product.model";
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
    await redis.sadd('cache_category_set',cacheKey)
    return categories
}
//GET COUNTS 
export const getCounts = async (find: Find) => {
    return await Category.countDocuments(find)
} 
//GET PRODUCTS BY CATEGORY 
export const getProductsByCategory = async (category_id: string) =>{
    const cacheKey = `category:${category_id}:products`;
    const cachedCategory = await redis.get(cacheKey);
    if(cachedCategory){
        return JSON.parse(cachedCategory)
    }
    const products = await Product.find({category_id})
    if(products.length === 0){ 
        throw new ApiError(404,"Không thấy sản phẩm nào trong danh mục")

    }
    await redis.set(cacheKey,JSON.stringify(products),'EX', 1800)
    return products
}
export const getCategoryById = async (id: string) => {
    const cacheKey = `category:${id}`
    const cachedCategory = await redis.get(cacheKey)
    if(cachedCategory){
        return JSON.parse(cachedCategory)
    }
    const category = await Category.findOne({_id: id, deleted: false})
    if(!category){
        throw new ApiError(404,'Không tìm thấy sản phẩm tương ứng')
    }
    await redis.set(cacheKey,JSON.stringify(category),'EX',1800)
    return category
}