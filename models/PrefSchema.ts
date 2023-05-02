import mongoose from "mongoose";
import { Schema , InferSchemaType} from "mongoose";

const glovesSchema = new Schema({
    short: Boolean,
    long: Boolean,
    thermo: Boolean
})

const pantsSchema = new Schema({
    shorts: Boolean,
    longs: Boolean
})

const clothesSchema = new Schema({
    cap: Boolean,
        scarf: Boolean,
        jacket: Boolean,
        thermoTop: Number,
        gloves: glovesSchema,
        pants: pantsSchema,
        thermoLeggins: Boolean,
        warmSocks: Number
})

const prefSchema = new Schema({
    
    prefName: {type: String, required: true},
    userSub: {type: String, required: true},
    minTemp: {type: Number, required: true},
    maxTemp: {type: Number, required: true},
    clothes: clothesSchema,
    notes: String,
    
})

export type PrefType = InferSchemaType<typeof prefSchema>
export const Pref = mongoose.model('Pref', prefSchema)