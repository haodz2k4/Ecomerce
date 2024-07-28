import { Schema, model } from "mongoose";

interface Product {
    product_id: Schema.Types.ObjectId,
    quantity: number
}
interface Cart {
    user_id: Schema.Types.ObjectId,
    products: Product[]
} 

const schemaCart = new Schema<Cart>({
    user_id: {type: Schema.Types.ObjectId, ref: 'user'},
    products: [
        {
            product_id: {type: Schema.Types.ObjectId, ref: 'product'},
            quantity: Number
        }
    ]
},{
    timestamps: true
})

export default model("cart",schemaCart)