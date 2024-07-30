import { Schema, model } from "mongoose";
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

export default model("Feedback",feedbackSchema)