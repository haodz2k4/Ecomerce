import { Schema, model } from "mongoose";
interface SettingGeneral {
    websiteName: string,
    logo: string,
    phone: string,
    email: string,
    address: string,
    copyright: string,
    updatedBy: Schema.Types.ObjectId,
}

const settingGeneralSchema = new Schema<SettingGeneral>({
    websiteName: {type: String, required: true, maxlength: 50},
    logo: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    copyright: {type: String, required: true},
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    }
},{
    timestamps: true
})

export default model("setting-general",settingGeneralSchema);