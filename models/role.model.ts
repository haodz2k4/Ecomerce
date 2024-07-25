import {Schema, model} from "mongoose"; 
interface Role {
    title: string,
    thumbnail: string,
    description: string,
    permissions?: string[],
    deleted: boolean,
    status: ('active' | 'inactive'),
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    deletedBy: Schema.Types.ObjectId
}
const roleSchema = new Schema<Role>({
    title: {
        type: String,
        required: true
    },
    thumbnail: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
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
export default model<Role>("role",roleSchema,"roles")