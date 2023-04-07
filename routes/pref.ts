import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { env } from "../util/envParser";
import { Pref, PrefType } from "../models/PrefSchema";
import { User, UserType } from "../models/UserSchema";
import newPrefValidator from "../util/newPrefValidator";
import updatePrefValidator from "../util/updatePrefValidator";


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
type PrefRequestSchemaType = z.infer<typeof PrefRequestSchema>;

router.get('/', async (req: Request, res: Response) =>{
    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    const [user] = await User.find<UserType>()
    const allPrefs = await Pref.find<PrefType>({userSub: user.sub});
    res.send(allPrefs)
})

router.get('/:id', async (req: Request, res: Response) =>{
    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    const prefID:string = req.params.id
    if (!prefID) return res.sendStatus(400)
    const pref = await Pref.findOne<PrefType>({_id: prefID});
    res.send(pref)
})


router.post('/', verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request: PrefType = req.body

    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    
    const [user] = await User.find<UserType>()
    const validPref = await newPrefValidator(request, user)
    
    if (!validPref) return res.status(400).json("One or more records exist for this temperature interval")
    
    await Pref.create<PrefType>(request);
    const userPrefs = await Pref.find<PrefType>({userSub: user.sub})
    res.send(userPrefs)
})

router.put('/:id', verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request:PrefType = req.body
    const prefID:string = req.params.id

    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    
    const [user] = await User.find<UserType>()
    const validPref = await updatePrefValidator(request, user, prefID)
    
    if (!validPref) return res.status(400).json("One or more records exist for this temperature interval")
    
    const updatedPref = await Pref.findOneAndUpdate<PrefType>({_id: prefID}, request, { new: true })
    
    if (!updatedPref) return res.status(404).json("")
    res.send(updatedPref)
})

router.delete('/:id', async(req: Request, res: Response) =>{
    const request:string = req.params.id
    const result = await Pref.deleteOne({_id: request})
    result.acknowledged ? res.json(result.acknowledged) : res.sendStatus(503) 
})


export default router