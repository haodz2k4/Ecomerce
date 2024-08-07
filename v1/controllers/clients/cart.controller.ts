import { Request, Response } from "express";
import { Error, Types } from "mongoose";
//models
import Cart from "../../models/cart.model"; 
import CartItem from "../../models/cart-item.model";
import validator from "validator";
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
                    as: 'product'
                }
            },
            {
                $unwind: '$cart' 
            },
            {
                $unwind: '$product'
            },
            {
                $match: {
                    'cart.user_id': userId
                }
            },
            {$project: {'product.title': 1,'cart._id': 1,'cart.user_id': 1,'product.price': 1,'product.discountPercentage': 1,'product.thumbnail': 1,quantity: 1}}
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
//[DELETE] "/cart/remove/:cartItemId"
export const remove = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.cartItemId;
    try {
        const cartItem = await CartItem.deleteOne({_id: id});
        if(cartItem.deletedCount === 0){
            res.status(404).json({message: "Không có sản phẩm nào bị xóa"});
            return;
        }
        res.status(200).json({message: "Xóa sản phẩm khỏi giỏ hàng thành công", cartItem});
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
//[DELETE] "/cart/remove/multi"
export const removeMulti = async (req: Request, res: Response) :Promise<void> =>{ 

    const ids = req.body.ids;
    try {
        const infoDelete = await CartItem.deleteMany({_id: {$in: ids}});
        if(infoDelete.deletedCount === 0){
            res.status(404).json({message: "Chưa có sản phẩm nào bị xóa"});
            return; 
        }
        res.status(200).json({message: "Xóa nhiều sản phẩm giỏ hàng thành công", infoDelete})

    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi xóa nhiều sản phẩm khỏi giỏ hàng", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}
//[PATCH] "/cart/change/quantity"
export const changeQuantity = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.body.id;
    const quantity = parseInt(req.body.quantity)
    try {
        const cartItem = await CartItem.findByIdAndUpdate({_id: id},{quantity},{new: true, runValidators: true} );
        if(!cartItem){
            res.status(404).json({message: "Không tìm thấy sản phẩm tương ứng"});
            return; 
        }

        res.status(200).json({message: "Cập nhật số lượng sản phẩm thành công ", cartItem})
    } catch (error) {
        console.error(error)
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thay đổi số lượng sản phẩm trong giỏ hàng", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 