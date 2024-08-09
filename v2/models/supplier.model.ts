import { Schema, model } from "mongoose";
interface contactInfo {
    email: string
    phone: string 
    address: string 
}
interface Supplier {
    name: string,
    contactInfo: contactInfo,
    deleted: boolean
}
const supplierSchema = new Schema({
    name: {type: String, required: true},
    contactInfo: {
        email: {type: String , required: true},
        phone: {type: String , required: true},
        address: {type: String , required: true}
    },
    status: {
        type: String,
        enum: ["active","inactive"],
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export default model("SupplierV2",supplierSchema)