import { Schema, model } from "mongoose";

interface Address {
    user_id: Schema.Types.ObjectId,
    street: string,
    city: string,
    District: string,
    defaultAdrress: boolean
} 

const addressSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    street: {type: String, required: true,minlength: 5},
    city:  {type: String, required: true,minlength: 3},
    District:  {type: String, required: true},
    defaultAdrress: {
        type: Boolean,
        default: false
    }
}) 

export default model("address",addressSchema);