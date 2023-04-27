import mongoose from "mongoose";
import { Schema , InferSchemaType} from "mongoose";


const prefSchema = new Schema({
    
    prefName: {type: String, required: true},
    userSub: {type: String, required: true},
    minTemp: {type: Number, required: true},
    maxTemp: {type: Number, required: true},
    clothes: {
        cap: Boolean,
        scarf: Boolean,
        jacket: Boolean,
        thermoTop: Number,
        gloves: {
            short: Boolean,
            long: Boolean,
            thermo: Boolean
        },
        pants: {
            shorts: Boolean,
            longs: Boolean
        },
        thermoLeggins: Boolean,
        warmSocks: Number
    },
    notes: String,
    
})

export type PrefType = InferSchemaType<typeof prefSchema>
export const Pref = mongoose.model('Pref', prefSchema)