import ApiError from "../../utils/ApiError.util";
import Product from "../models/product.model";

//GET LIST PRODUCTS
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
//GET COUNTS PRODUCTS
export const getCounts = async (find: any) :Promise<number> => {
    
    const counts = await Product.countDocuments(find);
    if(counts === 0){
        throw new ApiError(404,"Không tìm thấy sản phẩm nào")
    }
    return counts
}
//CHANGE STATUS
export const changeStatus = async (id: string, status: string) :Promise<any> =>{
    const product = await Product
    .findByIdAndUpdate(id,{status}, {new: true, runValidators: true})
    .select("status") 

    if(!product){
        throw new ApiError(404,"Không tìm thấy sản phẩm tương ứng")
    }
    return product
} 
//CHANGE MULTI DELETE
export const changeMultiDelte = async (ids :string[]) :Promise<any> => {
    if(ids.length < 0){
        throw new ApiError(400,"Vui lòng gửi ids")
    }
    const infoUpdate = await Product.updateMany({_id: {$in: ids}},{deleted: true}) 
    if(infoUpdate.modifiedCount === 0){
        throw new ApiError(404,"Không có sản phẩm nào bị xóa")
    }
    if(infoUpdate.modifiedCount !== ids.length) {
        throw new ApiError(400,"Không thể xóa hết sản phẩm")
    }
    return infoUpdate
} 
//CHANGE MULTI STATUS
export const changeMultiStatus = async (ids: string[], status: string) :Promise<any> =>{
    if(ids.length < 0){
        throw new ApiError(400,"Vui lòng gửi ids")
    } 
    const infoUpdate = await Product.updateMany({_id: {$in: ids}},{status: status},{runValidators: true})

    if(infoUpdate.modifiedCount === 0){
        throw new ApiError(404,"Không có sản phẩm nào được cập nhật")
    }else if(infoUpdate.matchedCount !== ids.length){
        throw new ApiError(400,"Không thể cập nhật hết sản phẩm")
    }
    return infoUpdate
} 
// CHANGE MULTI POSITION 
export const changeMultiPosition = async (ids: {id: string, position: string}[]) :Promise<any> =>{ 
    const products:any = [] 
    const promises = ids.map(item  => 
        Product.findByIdAndUpdate(item.id,{position: item.position},{runValidators: true, new: true})
        .then(update => {
            if(update) products.push(update)
        } )
        .catch(error => {
            throw new ApiError(500, `Lỗi khi cập nhật sản phẩm ${item.id}: ${error.message}`)
        })
    )

    await Promise.all(promises)
    if(products.length !== ids.length){ 
        throw new ApiError(400,"Không thể cập nhật vị trí hết sản phẩm")
    }
    return products
}

export const editProduct = async (id: string, body: any) =>{

    const product = await Product.findByIdAndUpdate(id,body,{new: true, runValidators: true});
    if(!product){
        throw new ApiError(400,"Không tìm thấy sản phẩm tương ứng")
    }
    return product
}