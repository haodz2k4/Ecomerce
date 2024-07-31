import { Schema, model } from "mongoose"; 

interface Point {
    user_id: Schema.Types.ObjectId,
    point_earned: number,
    reason: string,
    source: Schema.Types.ObjectId,
    sourceType: string
}
//100.000k = 10 points 
const pointSchema = new Schema<Point>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    point_earned: {
        type: Number,
        default: 0,
        min: 0
    },
    reason: {
        type: String,
        enum: ['purchase','feedback', 'refund', 'other'], 
        default: 'other'
    },
    source: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sourceType: {
        type: String,
        enum: ['order', 'feedback','account', 'other'], 
        required: true
    }
    
},{
    timestamps: true
}); 

export default model("point",pointSchema)