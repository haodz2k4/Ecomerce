import { Request, Response } from "express";
import Order from "../../models/order.model";
import OrderDetail from "../../models/order-detail.model";
import { Error } from "mongoose";
//[POST] "/checkout/order"
export const index = async (req: Request, res: Response) :Promise<void> =>{
    const products = req.body.products;
    const user_id = res.locals.user.id
    try {
        const order = new Order({user_id});
        for(const item of products){
            const orderDetail = new OrderDetail({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity
            });
            await orderDetail.save();
        }
        await order.save();

        res.status(200).json({message: "Thêm mới đơn hàng thành công", order})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm vào cơ sỡ dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
} 
