import { model, Schema, Types } from "mongoose";
interface Inventory {
    product_id: Schema.Types.ObjectId,
    quantity: number,
    deleted: boolean
}

const inventorySchema = new Schema<Inventory>({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0,'Số lượng ít nhất phải là 0'],
        max: [1000,'Số lượng ít nhất phải là 1000']
    },
    deleted: {
        type: Boolean,
        default: true
    }
})

export default model<Inventory>("inventory",inventorySchema,"inventories")