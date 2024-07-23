import {Schema, model} from "mongoose"; 
interface Role {
    title: string,
    avatar: string,
    description: string,
    permissions?: string[],
    deleted: boolean,
    status: ('active' | 'inactive')
}
const roleSchema = new Schema<Role>({
    title: {
        type: String,
        required: true
    },
    avatar: String,
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
    }

})
export default model("role",roleSchema,"roles")