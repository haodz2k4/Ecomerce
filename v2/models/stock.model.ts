import { Schema, model } from "mongoose";

interface Stock {
    product_id: Schema.Types.ObjectId
    supplier_id:  Schema.Types.ObjectId
    quantity: Number,
    warehouseLocation: String,
    deleted:boolean
}
const stockSchema = new Schema<Stock>({
    product_id: {type: Schema.Types.ObjectId, ref: "ProductV2", required: true},
    supplier_id: {type: Schema.Types.ObjectId, ref: "SupplierV2", required: true},
    quantity: {type: Number, min: 0, required: true},
    warehouseLocation: {type: String, required: true},
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export default model("StockV2",stockSchema)