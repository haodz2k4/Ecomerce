import ApiError from "../../utils/ApiError.util";
import Product from "../models/product.model";
import redis from "../../config/redis";
//GET LIST PRODUCTS
export const getProducts = async (find: any, pagination: any, sort: any): Promise<any> => {
    const cacheKey = `products:${JSON.stringify(find)}:${pagination.limit}:${pagination.skip}:${JSON.stringify(sort)}`;

    const cachedProducts = await redis.get(cacheKey);
    if (cachedProducts) {
        console.log('Lấy sản phẩm từ Redis cache');
        return JSON.parse(cachedProducts);
    }
    const products = await Product
        .find(find)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .select("-deleted")
        .sort(sort);

    if (products.length === 0) {
        throw new ApiError(404, "Không tìm thấy sản phẩm nào hết");
    }
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);

    return products;
}
//GET PRODUCT 
export const getProduct = async (find: {_id: string, deleted?: boolean, status?: string}) => {
    const product = await Product.findOne(find)
    if(!product){
        throw new ApiError(404,"Không tìm thấy sản phẩm")
    }
    return product
}
//GET COUNTS PRODUCTS
export const getCounts = async (find: any = {}) :Promise<number> => {
    
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
//CHANGE POSITION 
export const changePosition = async (id: string, position: number) =>{
    const product = await Product
    .findByIdAndUpdate(id,{position},{runValidators: true, new: true})
    .select("position")
    if(!product){
        throw new ApiError(404,"Không tìm thấy sản phẩm tương ứng")
    }
    return product 
}
//CHANGE CATEGORY 
export const changeCategory = async (id: string, category: string) =>{
    const product = await Product
    .findByIdAndUpdate(id,{category_id: category},{new: true, runValidators: true})
    .select("category_id")
    .populate('category_id','title') 
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
        Product.findByIdAndUpdate(item.id,{position: item.position},{runValidators: true, new: true}).select("position")
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
//EDIT PRODUCTS
export const editProduct = async (id: string, body: any) =>{

    const product = await Product.findByIdAndUpdate(id,body,{new: true, runValidators: true});
    if(!product){
        throw new ApiError(400,"Không tìm thấy sản phẩm tương ứng")
    }
    return product
}
//DELETE PRODUCTS 
export const deleteProduct = async (id: string) => {
    const product = await Product.findByIdAndUpdate(id, {deleted: true},{new: true}).select("deleted");

    if(!product){
        throw new ApiError(400,"Không tìm thấy sản phẩm")
    }
    return product

} 
//CREATE PRODUCTS 
export const create = async (body: any) => { 
    const product = new Product(body);
    await product.save()
    return product
}   
//SUGGESTION 
export const getSuggestions = async (keyword: string, find: {deleted: boolean, status?: string}) => { 
    const cacheKey = `products:${JSON.stringify(keyword)}:${JSON.stringify(find)}`
    const cachedProduct = await redis.get(cacheKey)
    if(cachedProduct){
        return JSON.parse(cachedProduct)
    }
    const products = await Product.find({...find, title: new RegExp(keyword)}).select("title thumbnail")
    await redis.set(cacheKey,JSON.stringify(products),'EX',3600)
    return products
}