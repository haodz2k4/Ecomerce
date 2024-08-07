import ApiError from "../../utils/ApiError.util";
import Product from "../models/product.model";

export const GetProucts = async (find: any, limit: number, skip: number) :Promise<any> => {
    const products = await Product
    .find(find)
    .limit(limit)
    .skip(skip)
    if (products.length === 0){
        throw new ApiError(404,"Không tìm thấy sản phẩm nào hết")
    }

    return products
} 
export const GetCounts = async (find: any) :Promise<number> => {
    
    const counts = await Product.countDocuments(find);
    if(counts === 0){
        throw new ApiError(404,"Không tìm thấy sản phẩm nào")
    }
    return counts
}