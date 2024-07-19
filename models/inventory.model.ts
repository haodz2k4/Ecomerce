import { model, Schema } from "mongoose";
interface Inventory {
    product_id: string,
    quantity: number,
    deleted: boolean
}

const inventorySchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0,'Số lượng ít nhất phải là 0'],
        max: [1000,'Số lượng ít nhất phải là 1000']
    },
    deleted: {
        type: Boolean,
        default: 0
    }
})

export default model("inventory",inventorySchema,"inventories")