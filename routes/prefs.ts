import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { env } from "../util/envParser";
import { Pref, PrefType } from "../models/PrefSchema";
import { User, UserType } from "../models/UserSchema";
import mongoose from "mongoose";


const router = express.Router();


const PrefRequestSchema = z.object({
    userSub: z.number(),
    prefName: z.string(),
    minTemp: z.number(),
    maxTemp: z.number(),
    clothes: z.object({
        cap: z.boolean().optional(),
        scarf: z.boolean().optional(),
        jacket: z.boolean().optional(),
        thermoTop: z.number().optional(),
        gloves: z.object({
            long: z.boolean().optional(),
            thermo: z.boolean().optional()
        }).optional(),
        pants: z.object({
            shorts: z.boolean().optional(),
            longs: z.boolean().optional()
        }).optional(),
        thermoLeggins: z.boolean().optional(),
        warmSocks: z.number().optional(),
    }),
    notes: z.string().optional()
})

type PrefRequestType = z.infer<typeof PrefRequestSchema>

router.post('/', verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request: PrefType = req.body

    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    
    const [user] = await User.find<UserType>()
    
    // const prevPrefs = await Pref.find({userSub: user.sub})

    // ide kell logika, kiszurni h ne utkozzenek az uj pref temp-jei a meglevokkel
    
    const newPref = await Pref.create<PrefType>(request)
    const allPrefs = await Pref.find({userSub: user.sub})
    res.send(allPrefs)
})

router.put('/:id', verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request:PrefType = req.body

    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)

    // const prevPrefs = await Pref.find({userSub: user.sub})

    // ide kell logika, kiszurni h ne utkozzenek a frissitett pref temp-jei a meglevokkel

    const updatedPref = await Pref.findOneAndUpdate<PrefType>({_id: req.params.id}, request, { new: true })
    
    if (!updatedPref) return res.sendStatus(404)
    res.send(updatedPref)
})

router.delete('/:id', async(req: Request, res: Response) =>{
    const request:string = req.params.id
    const result = await Pref.deleteOne({_id: request})
    result.acknowledged ? res.json(result.acknowledged) : res.sendStatus(503) 
})


export default router