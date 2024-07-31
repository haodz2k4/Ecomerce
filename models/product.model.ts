import { Schema, model, PreSaveMiddlewareFunction } from "mongoose"; 
import slugify from "slugify";
import { createUniqueSlug } from "../helpers/slug.helper";
import Inventory from './inventory.model';
interface Product {
    title: string,
    product_category_id: Schema.Types.ObjectId,
    description: string,
    highlighted: string,
    avatar: string,
    price: number,
    discountPercentage: number,
    deleted: boolean,
    position: number,
    slug: string,
    status: ("active" | "inactive"),
    createdAt: Date,
    updatedAt: Date,
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    deletedBy: Schema.Types.ObjectId,
    [key: string]: any
    
}
const productSchema = new Schema<Product>({
    title: {
        type: String,
        required: true
    },
    product_category_id: {type: Schema.Types.ObjectId, ref: 'category'},
    description: String,
    avatar: String,
    price: {
        type: Number,
        min: [0,'Giá tiền không được là số âm'],
        required: true
    },
    discountPercentage: {
        type: Number,
        min: [0,'Phần trăm giảm giá không được là số âm'],
        max: [100,'Phần trăm giảm giá tối đa là 100'],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    highlighted: {
        type: String,
        default: "0" 
    },
    position: {
        type: Number,
        min: [0,'Vị trí không được là số âm']
    },
    slug: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active","inactive"]
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

productSchema.pre('save',async function(next) { 
    if(this.title && this.isModified("title")){
        const initSlug = slugify(this.title,{lower: true, strict: true});
        this.slug = await createUniqueSlug(model('product'),initSlug);
    }

    next();
})

productSchema.post('save',async function(doc) {
    
    const inventory = new Inventory({
        product_id: doc._id,
        quantity: 0
    })
    await inventory.save();
})
export default model<Product>("product",productSchema,"products");