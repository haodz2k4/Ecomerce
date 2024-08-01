import { Schema, model } from "mongoose";


interface Cart {
    user_id: Schema.Types.ObjectId,
} 

const schemaCart = new Schema<Cart>({
    user_id: {type: Schema.Types.ObjectId, ref: 'user'}
},{
    timestamps: true
})


export default model("cart",schemaCart)