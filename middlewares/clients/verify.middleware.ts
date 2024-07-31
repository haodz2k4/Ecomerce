import { Request, Response, NextFunction } from "express"; 
import Order from "../../models/order.model";
import OrderItem from "../../models/order-detail.model";
export const verifyPurchase = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const product_id =req.params.productId;
    const user_id = res.locals.user.id;  
    try {
        const orders = await Order.find({user_id}).select("id"); 
<<<<<<< HEAD
        if(orders.length === 0){
=======
        if(!orders){
>>>>>>> 04d70035bdfd939a2e882df29b7554a52de1a26f
            res.status(404).json({message: "Người này chưa mua bất kì sản phẩm nào hết"});
            return;
        } 
        const isExistsOrderItem = await OrderItem.exists({product_id, order_id: {$in: orders.map(item => item.id)}});

        if(!isExistsOrderItem){
            res.status(403).json({message: "Bạn không được quyền thao tác trên sản phẩm này"});
            return;
        } 
        next();
    } catch (error) {
        next(error);
    } 
}