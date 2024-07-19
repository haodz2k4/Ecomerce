import { Schema, model } from 'mongoose';

interface Category {
    title: string,
    description: string,
    thumbnail: string,
    deleted: false,
    position: number,
    status: ('active' | 'inactive'),
    parent_category: string,
    createdAt: Date,
    updatedAt: Date,
    slug: string 

}

const categorySchema = new Schema<Category>({
    title: {
        type: String,
        unique: true
    },
    description: String,
    thumbnail: String,
    deleted: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        min: [0,'Vị trí không được dưới số âm']
    },
    status: {
        type: String,
        enum: ["active","inactive"]
    },
    parent_category: {
        type: String,
        default: ""
    },
    slug: String,
},{
    timestamps: true
})

export default model<Category>("category",categorySchema,"categories")