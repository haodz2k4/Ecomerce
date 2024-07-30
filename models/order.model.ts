import {Schema, model} from "mongoose";


interface Order {
    user_id: Schema.Types.ObjectId,
    address_id: Schema.Types.ObjectId
}
const orderSchema = new Schema<Order>({
    user_id: {type: Schema.Types.ObjectId, required: true,ref: 'user'},
    address_id: {type: Schema.Types.ObjectId, required: true, ref: 'address'}
},{timestamps: true}) 


export default model("order",orderSchema)