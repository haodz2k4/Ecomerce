import {model, Schema} from "mongoose";
interface Supplier {
    name: string,
    phone: string,
    email: string,
    address: string,
    status: ("active" | "inactive"),
    notes: string,
    deleted: boolean
}
const supplierSchema = new Schema<Supplier>({
    name: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    notes: String,
    status: {
        type: String,
        default: "active",
        enum: ["active","inactive"]
    },
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
}) 

export default model("supplier",supplierSchema);