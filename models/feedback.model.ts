import { Schema, model } from "mongoose";
import Point from "../models/point.model";
import Inventory from "../models/inventory.model"; 
import Product from "../models/product.model";
interface FeedBack {
    order_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    product_id: Schema.Types.ObjectId,
    rating: number,
    comment: string,
    images: string[],
    deleted: boolean
}
const feedbackSchema = new Schema<FeedBack>({ 
    order_id: {type: Schema.Types.ObjectId, ref: 'order'},
    user_id: {type: Schema.Types.ObjectId, ref: 'user'},
    product_id: {type: Schema.Types.ObjectId, ref: 'product'},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: true},
    images: {type: [String], default: []},
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})  

feedbackSchema.post('save',async function(doc) {

    const discountPoint = 10000;
    const inventory = await Inventory.findOne({product_id: doc.product_id}).select("quantity");
    const product = await Product.findById(doc.product_id).select("price discountPercentage"); 
    if(typeof product?.discountPercentage !== 'number' || typeof inventory?.quantity !== 'number'){
        throw new Error('discountPercentage or quantity is not a number')
    }
    const totalPrice = (product?.price as number * (100 -  product?.discountPercentage as number) /100) * inventory?.quantity as number;   
    console.log(totalPrice)
    const point_earned = totalPrice / discountPoint;
    const point =new Point({
        user_id: doc.user_id,
        point_earned: point_earned,
        reason: 'feedback',
        source: doc._id,
        sourceType: 'feedback'
    }) 

    await point.save();
})

export default model("Feedback",feedbackSchema)