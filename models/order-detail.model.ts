import { Schema, model } from "mongoose";

interface oderDetail {
    order_id: Schema.Types.ObjectId,
    product_id: Schema.Types.ObjectId,
    quantity: Number
}
const orderDetail = new Schema<oderDetail>({
    order_id: {type: Schema.Types.ObjectId},
    product_id: {type: Schema.Types.ObjectId, required: true},
    quantity: Number
},{
    timestamps: true
}) 

export default model("order-detail",orderDetail)