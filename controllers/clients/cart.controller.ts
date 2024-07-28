import { Request, Response } from "express";
import { Error, Types } from "mongoose";
//models
import Cart from "../../models/cart.model"; 
import CartItem from "../../models/cart-item.model";
//[GET] "/cart"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    let userId = res.locals.user.id;
    userId = Types.ObjectId.createFromHexString(userId)
    try {
        const cartItems = await CartItem.aggregate([
            {
                $lookup: {
                    from: 'carts',
                    localField: 'cart_id',
                    foreignField: '_id',
                    as: 'cart'
                }
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $unwind: '$cart' 
            },
            {
                $match: {
                    'cart.user_id': userId
                }
            },
            {$project: {'products.title': 1,'cart._id': 1,'cart.user_id': 1,'products.price': 1,'products.discountPercentage': 1,'products.thumbnail': 1,quantity: 1}}
        ])
    
        res.json({cartItems})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}
//[POST] "/cart/add/:productId"
export const add = async (req: Request, res: Response) :Promise<void> =>{
    const product_id = req.params.productId;
    const cart_id = res.locals.cart.id;
    const quantity = req.body.quantity;
    try { 
        const isExistsProduct = await CartItem.findOne({product_id});
        if(isExistsProduct){
            const updateQuantity = quantity + isExistsProduct.quantity;
            const cartItem = await CartItem.findByIdAndUpdate(isExistsProduct.id,{quantity: updateQuantity}, {new: true, runValidators: true});
            res.status(200).json({message: "Thêm sản phẩm vào giỏ hàng thành công", cartItem});

        }else{
            const cartItem = new CartItem({cart_id, product_id, quantity});
            await cartItem.save();
            res.status(201).json({message: "Thêm sản phẩm vào giỏ hàng thành công", cartItem})
        }
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm sản phẩm vào giỏ hàng", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}