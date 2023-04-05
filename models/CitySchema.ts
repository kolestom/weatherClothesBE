import mongoose from "mongoose";
import { Schema , InferSchemaType} from "mongoose";

const citySchema = new mongoose.Schema({
    name: String,
    location: {
        country: String,
        lat: Number,
        lon: Number
    }
})

export type cityType = InferSchemaType<typeof citySchema>
export const City = mongoose.model('City', citySchema)