import mongoose from "mongoose";
import { Schema , InferSchemaType} from "mongoose";

const citySchema = new mongoose.Schema({
    city: {type: String, required: true},
    country: {type: String, required: true},
    lat: Number,
    lon: Number
})

export type CityType = InferSchemaType<typeof citySchema>
export const City = mongoose.model('City', citySchema)