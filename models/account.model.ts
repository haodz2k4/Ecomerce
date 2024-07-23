import { Schema, model, Types } from "mongoose";
interface Account {
    fullName: string,
    avatar: string,
    phone: string,
    email: String,
    role_id: Schema.Types.ObjectId,
    password: string,
    token: string,
    deleted: boolean,
    status: string
}
const accountSchema = new Schema<Account>({
    fullName: {
        type: String,
        required: true
    },
    avatar: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    }, 
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    },
    password: {
        type: String,
        required: true
    },
    token: String, 
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "active",
        enum: ["active","inactive"]
    }
},{
    timestamps: true
}) 

export default model<Account>("account",accountSchema,"accounts")