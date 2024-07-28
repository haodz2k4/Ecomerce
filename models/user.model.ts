import {Schema, model} from "mongoose";
import slugify from "slugify";
import { hash } from "bcrypt";
import { createUniqueSlug } from "../helpers/slug.helper";
interface User {
    fullName: string,
    avatar: string,
    email: string,
    phone: string,
    password: string,
    gender: string,
    slug: string,
    birthDate: Date,
    deleted: boolean,
    status: string
}
const userSchema = new Schema<User>({
    fullName: {type: String, required: true},
    avatar: String,
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    slug: String,
    gender: {type: String, required: true, enum: ['nam','nữ']},
    birthDate: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active","inactive"],
        default: "active"
    }
},{
    timestamps: true
})  

userSchema.pre('save',async function(next) {
    if(this.isModified('fullName')){
        const slug = slugify(this.fullName,{lower: true, strict: true});
        this.slug =await createUniqueSlug(model('user'),slug);
    }
    this.password = await hash(this.password,10);
    next();
})

export default model<User>("user",userSchema)