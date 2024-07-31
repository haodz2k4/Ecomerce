import { Schema, model } from "mongoose"; 

interface Point {
    user_id: Schema.Types.ObjectId,
    point_earned: number,
    reason: string,
    source: Schema.Types.ObjectId,
    sourceType: string,
    deleted: boolean
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
        required: true,
        refPath: 'sourceType'
    },
    sourceType: {
        type: String,
        enum: ['order', 'Feedback','account'], 
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }
    
},{
    timestamps: true
}); 

export default model("point",pointSchema)