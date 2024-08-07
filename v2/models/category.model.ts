import {Schema, model} from "mongoose"

interface Category {
    title: string,
    thumbnail: string,
    description: string,
    status: string,
    deleted: boolean,
    slug: string,
    parent_category: Schema.Types.ObjectId
}

const categorySchema = new Schema<Category>({
    title: {type: String, required: true, unique: true, minlength: 3, maxlength: 200},
    thumbnail: String,
    description: String ,
    deleted: {
        type: Boolean,
        default: false 
    },
    status: {
        type: String,
        enum: ["active","inactive"],
        default: "active"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parent_category: {type: Schema.Types.ObjectId, ref: 'CategoryV2'} 
}, {timestamps: true})

export default model("CategoryV2",categorySchema)