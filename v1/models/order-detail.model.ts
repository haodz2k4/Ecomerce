import { Schema, model } from "mongoose";

interface OrderDetail {
    order_id: Schema.Types.ObjectId,
    product_id: Schema.Types.ObjectId,
    quantity: Number
}
const orderDetail = new Schema<OrderDetail>({
    order_id: {type: Schema.Types.ObjectId,required: true, ref: 'order'},
    product_id: {type: Schema.Types.ObjectId, required: true, ref: 'product'},
    quantity: Number
},{
    timestamps: true
}) 

export default model<OrderDetail>("order-detail",orderDetail)