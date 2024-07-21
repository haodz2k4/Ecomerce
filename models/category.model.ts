import { createUniqueSlug } from './../helpers/slug.helper';
import { Schema, model } from 'mongoose';
import slugify from 'slugify';
interface Category {
    title: string,
    description: string,
    thumbnail: string,
    deleted: false,
    position: number,
    status: ('active' | 'inactive'),
    parent_category: string,
    children: Category[],
    createdAt: Date,
    updatedAt: Date,
    slug: string 

}

const categorySchema = new Schema<Category>({
    title: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    description: String,
    thumbnail: String,
    deleted: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        required: true,
        min: 0
    },
    status: { 
        enum: ['active', 'inactive'], 
        type: String,
        default: 'active'
    },
    parent_category: {
        type: String,
        default: ""
    },
    slug: {
        type: String
    },
},{
    timestamps: true
})
categorySchema.pre('save',async function(next): Promise<void>{
    if(this.title && this.isModified("title")){
        const initSlug = slugify(this.title, {lower: true, strict: true });
        this.slug = await createUniqueSlug(model('category'),initSlug)
    }

    next();
})
export default model<Category>("category",categorySchema,"categories")