import {Schema, model} from "mongoose";


interface Order {
    user_id: Schema.Types.ObjectId,
    address_id: Schema.Types.ObjectId,
    deleted: boolean
}
const orderSchema = new Schema<Order>({
    user_id: {type: Schema.Types.ObjectId, required: true,ref: 'user'},
    address_id: {type: Schema.Types.ObjectId, required: true, ref: 'address'},
    deleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true}) 


export default model("order",orderSchema)