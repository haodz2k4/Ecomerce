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
    slug: string,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    deletedBy: Schema.Types.ObjectId

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
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    }
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