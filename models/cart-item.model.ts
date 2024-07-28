import { Schema, model } from "mongoose";

interface CartItem {
    cart_id: Schema.Types.ObjectId,
    product_id: Schema.Types.ObjectId,
    quantity: number
}

const cartItemSchema = new Schema<CartItem>({
    cart_id: {type: Schema.Types.ObjectId, ref: 'cart', required: true},
    product_id: {type: Schema.Types.ObjectId, ref: 'product', required: true},
    quantity: {
        type: Number,
        required: true
    }
}) 

export default model<CartItem>("cart-item",cartItemSchema)