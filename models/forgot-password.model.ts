import { Schema, model } from "mongoose";

interface ForgotPassword {
    email: string,
    code: string,
    expireAt: Date
}
const forgotPasswordSchema = new Schema<ForgotPassword>({
    email: {type: String, required: true},
    code: {type: String, required: true},
    expireAt: {type: Date, expires: '1m'}
},{
    timestamps: true
})

export default model<ForgotPassword>("forgot-password",forgotPasswordSchema)