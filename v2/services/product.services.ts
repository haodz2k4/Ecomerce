import ApiError from "../../utils/ApiError.util";
import Product from "../models/product.model";

export const getProucts = async (find: any, limit: number, skip: number) :Promise<any> => {
    const products = await Product
    .find(find)
    .limit(limit)
    .skip(skip)
    .select("-deleted")
    if (products.length === 0){
        throw new ApiError(404,"Không tìm thấy sản phẩm nào hết")
    }

    return products
} 
export const getCounts = async (find: any) :Promise<number> => {
    
    const counts = await Product.countDocuments(find);
    if(counts === 0){
        throw new ApiError(404,"Không tìm thấy sản phẩm nào")
    }
    return counts
}
export const changeStatus = async (id: string, status: string) :Promise<any> =>{
    const product = await Product
    .findByIdAndUpdate(id,{status}, {new: true, runValidators: true})
    .select("status") 

    if(!product){
        throw new ApiError(404,"Không tìm thấy sản phẩm tương ứng")
    }
    return product
}