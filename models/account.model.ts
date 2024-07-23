import { Schema, model, Types } from "mongoose";
import {hash} from "bcrypt";
import { generateString } from "../helpers/generate.helper";
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
        unique: true,
    }, 
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        required: true
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

accountSchema.pre('save',async function (next) {

    if(!this.isModified('password') && !this.isModified('token')){
        next();
        return;
    } 
    try {
        this.token = generateString(30);
        this.password = await hash(this.password,10);
        next();
    } catch (error) {
        console.error(error);
        next();
    }
    
})
export default model<Account>("account",accountSchema,"accounts")