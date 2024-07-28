import { model, Schema } from "mongoose";

interface Favorite {
    product_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    createdAt: Date
}
const favoriteSchema = new Schema<Favorite>({
    product_id: {type: Schema.Types.ObjectId, ref: 'product'},
    user_id: {type: Schema.Types.ObjectId, ref: 'user'},
},{
    timestamps: true
}) 

export default model('favorite',favoriteSchema)