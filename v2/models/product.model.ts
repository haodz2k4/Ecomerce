import { Schema, model } from 'mongoose'; 
import slugify from 'slugify';
import { createUniqueSlug } from '../../helpers/slug.helper';
interface Product {
    title: string,
    category_id: Schema.Types.ObjectId,
    description: string,
    highlighted: string,
    thumbnail: string,
    price: number,
    discountPercentage: number,
    deleted: boolean,
    position: number,
    slug: string,
    status: ("active" | "inactive"),
    
}
const productSchema = new Schema<Product>({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 10 
    },
    category_id: {type: Schema.Types.ObjectId, ref: 'categoryv2'},
    description: String,
    thumbnail: String,
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
        enum: ["0","1"],
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
    }
},{
    timestamps: true
}) 

productSchema.pre('save',async function(next) {
    if(this.isModified('title')){
        const newSlug = slugify(this.title,{lower: true, strict: true})
        this.slug = await createUniqueSlug(model('ProductV2'),newSlug)
    }

    next()
})

export default model("ProductV2",productSchema)