import mongoose from "mongoose";
import { Schema , InferSchemaType} from "mongoose";


const userSchema = new Schema({
    name: {type: String, required: true},
    sub: {type: String, required: true},
    email: {type: String, required: true},
    cities: [{
        type: mongoose.Schema.Types.ObjectId
    }]

})
export type UserType = InferSchemaType<typeof userSchema>
export const User = mongoose.model('User', userSchema)