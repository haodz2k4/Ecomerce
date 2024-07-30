import { getPagination } from './../../helpers/pagination.helper';
import { buildFindQuery, buildSorting } from './../../helpers/search.helper';
import { Request, Response } from "express";
//model
import Product from "../../models/product.model";
import Category from "../../models/category.model"; 
import Inventory from "../../models/inventory.model";
import Favorite from "../../models/favorite.model"; 
import FeedBack from "../../models/feedback.model";
import { Error } from "mongoose";
//[GET] "/products"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    try {

        const counts = await Product.countDocuments({deleted: false, status: "active"});
        const pagination = getPagination(req, counts, 30);
       
        const products = await Product.aggregate([
            {
                $match: {deleted: false, status: "active"}
            },
            {
                $lookup: {
                    from: "inventories",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "inventory"
                }
            },
            {
                $unwind: {
                    path: "$inventory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    quantity: { $ifNull: ["$inventory.quantity", 0] }
                }
            },
            {
                $project: {
                    title: 1,
                    price: 1,
                    discountPercentage: 1,
                    avatar: 1,
                    quantity: 1,
                    slug: 1,
                    position: 1,
                }
            },
            {
                $limit: pagination.limit
            },
            {
                $skip: pagination.skip
            },
            {
                $sort: {
                    position: -1
                }
            }
        ]);
        
        res.status(200).json({products});
    } catch (error) { 
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn cơ sở dữ liệu", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}
//[GET] "/products/detail/:slug"
export const detail = async (req: Request, res: Response) :Promise<void> =>{
    const slug = req.params.slug;

    try { 
        const product = await Product.findOne({slug: slug, deleted: false, status: "active"});
        
        if(!product){
            res.status(404).json({message: "Sản phẩm không tồn tại"});
            return;
        } 
        const countFavorite = await Favorite.countDocuments({product_id: product.id})
        const category = await Category.findById(product.product_category_id).select('title thumbnail');
        const inventory = await Inventory.findOne({product_id: product.id}).select('quantity')
        res.status(200).json({product,category,inventory, countFavorite})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn", error: error.message});
            return;
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}
//[GET] "/products/:slug"
export const category = async (req: Request, res: Response) :Promise<void> =>{
    const slug = req.params.slug;

    try {
        const products = await Product.aggregate([ 
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product_category_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $match: {deleted: false, status: "active",'category.slug': slug}
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $lookup: {
                    from: 'inventories',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'inventory'
                }
            },
            {
                $unwind: {
                    path: '$inventory',
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $addFields: {
                    quantity: { $ifNull: ["$inventory.quantity", 0] } 
                }
            },
            {
                $project: {
                    title: 1,
                    avatar: 1,
                    price: 1,
                    discountPercentage: 1,
                    slug: 1,
                    quantity: 1,
                    position: 1
                }
            }
        ]) 

        res.json({products})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dababase", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
 
//[POST] "/products/:id/feedback/add/" 
export const addFeedback = async (req: Request, res: Response) :Promise<void> =>{
    const product_id = req.params.productId;
    const user_id = res.locals.user.id; 
    const order_id = res.locals.user.order_id;  
    const {rating, comment, images} = req.body; 

    
    try { 
        const isExists = await FeedBack.exists({user_id, product_id});
        if(isExists){
            res.status(400).json({message: "Bạn đã đánh giá sản phẩm này rồi"});
            return;
        }
        const feedback = new FeedBack({order_id,product_id, user_id,rating, comment, images});
        await feedback.save();

        res.status(200).json({message: "Đánh giá sản phẩm thành công", feedback})
    } catch (error) { 
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm đánh giá vào database", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }

}
//[PATCH] "/products/:productId/feedback/edit/:feedbackId"
export const editFeedback = async (req: Request, res: Response) :Promise<void> =>{
    const feedback_id = req.params.feedbackId; 
    const body = req.body;
    try {
        const feedback = await FeedBack.findByIdAndUpdate(feedback_id,body,{new: true, runValidators: true}); 
        if(!feedback){
            res.status(404).json({message: "Không tìm thấy feedback tương ứng"});
            return;
        }
        res.status(200).json({message: "Cập nhật feedback thành công",feedback})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi chỉnh sửa đánh giá", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
//[PATCH] "/products/:productId/feedback/delete/:feedbackId"
export const deleteFeedback = async (req: Request, res: Response) :Promise<void> =>{
    const feedback_id = req.params.feedbackId;

    try {
        const feedback = await FeedBack.findByIdAndUpdate(feedback_id,{deleted: true},{new: true}).select("deleted");
        if(!feedback){
            res.status(400).json({message: "Không tìm thấy Feedback tương ứng"});
            return; 
        }

        res.status(200).json({message: "Xóa Feedback thành công", feedback})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi Xóa đánh giá", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}