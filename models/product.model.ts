import { Schema, model } from "mongoose";
interface Product {
    title: string,
    product_category_id: Schema.Types.ObjectId,
    description: string,
    avatar: string,
    price: number,
    discountPercentage: number,
    deleted: boolean,
    position: number,
    
    status: ("active" | "inactive"),
    createdAt: Date,
    updatedAt: Date
}
const productSchema = new Schema<Product>({
    title: {
        type: String,
        required: true
    },
    product_category_id: {type: Schema.Types.ObjectId, ref: 'category'},
    description: String,
    avatar: String,
    price: {
        type: Number,
        min: [0,'Giá tiền không được là số âm']
    },
    discountPercentage: {
        type: Number,
        min: [0,'Phần trăm giảm giá không được là số âm'],
        max: [100,'Phần trăm giảm giá tối đa là 100']
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    position: {
        type: Number,
        min: [0,'Vị trí không được là số âm']
    },
    status: {
        type: String,
        enum: ["active","inactive"]
    },
},{
    timestamps: true
})

export default model("product",productSchema,"products");