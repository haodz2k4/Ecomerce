
import ApiError from "../../utils/ApiError.util";
import Supplier from "../models/supplier.model";
//interface to find 
import { Find } from "../../helpers/search.helper"
import { Pagination } from "../../helpers/pagination.helper";
//GET LIST SUPPLIER 
export const getSuplliers = async (find: Find, pagination: Pagination, select: string ) => {
    const suplliers = await Supplier
    .find(find)
    .limit(pagination.limit)
    .skip(pagination.skip)
    .select(select)
    if(suplliers.length  === 0){
        throw new ApiError(404,"Không có sản phẩm nào hết")
    }
    return suplliers
}
export const getCounts = async (find: Find) => {
    return await Supplier.countDocuments(find)
}