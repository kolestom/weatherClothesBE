import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { z } from "zod";
import { Pref, PrefType } from "../models/PrefSchema";
import { User, UserType } from "../models/UserSchema";
import prefValidatorNew from "../util/prefValidatorNew";
import prefValidatorUpdate from "../util/prefValidatorUpdate";
import authMW from "../middleWares/authMW";


const router = express.Router();


const PrefRequestSchema = z.object({
    userSub: z.string(),
    prefName: z.string(),
    minTemp: z.number(),
    maxTemp: z.number(),
    clothes: z.object({
        cap: z.boolean().optional(),
        scarf: z.boolean().optional(),
        jacket: z.boolean().optional(),
        thermoTop: z.number().optional(),
        gloves: z.object({
            short: z.boolean().optional(),
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

router.get('/', authMW, async (req: Request, res: Response) =>{
    // const user = await User.findOne<UserType>({sub: res.locals.sub})
    // if (!user) return res.status(404).json('User not found')
    const allPrefs = await Pref.find<PrefType>({userSub: res.locals.sub});
    res.send(allPrefs)
})

router.get('/:temp', authMW, async (req: Request, res: Response) =>{
    
    const temp = parseInt(req.params.temp) 
    if (!temp) return res.sendStatus(400)

    const [matchedPref] = await Pref.find<PrefType>({
        $and: [
            {userSub: res.locals.sub},
            {maxTemp: {$gte: temp}},
            {minTemp: {$lte: temp}}
        ]
    });
    if (!matchedPref) return res.status(404).json("No preference for this temperature")
    res.send(matchedPref)
})


router.post('/', authMW, verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request: PrefType = req.body

    const user = await User.findOne<UserType>({sub: res.locals.sub})
    
    if (!user) return res.sendStatus(401)
    const validPref = await prefValidatorNew(request, user)
    
    if (!validPref) return res.status(400).json("One or more records exist for this temperature interval")
    
    await Pref.create<PrefType>(request);
    const userPrefs = await Pref.find<PrefType>({userSub: user.sub})
    res.send(userPrefs)
})

router.put('/:id', authMW, verifyReqSchema(PrefRequestSchema), async (req: Request, res: Response) =>{
    const request:PrefType = req.body
    const prefID:string = req.params.id

    const user = await User.findOne<UserType>({sub: res.locals.sub})
    
    
    if (!user) return res.sendStatus(401)
    const validPref = await prefValidatorUpdate(request, user, prefID)
    
    if (!validPref) return res.status(400).json("One or more records exist for this temperature interval")
    
    const updatedPref = await Pref.findOneAndUpdate<PrefType>({_id: req.params.id}, request, { new: true })
    
    if (!updatedPref) return res.status(404).json("No pref found")
    const userPrefs = await Pref.find<PrefType>({userSub: user.sub})
    res.send(userPrefs)
})

router.delete('/:id', authMW, async(req: Request, res: Response) =>{
    const request:string = req.params.id
    const result = await Pref.deleteOne({_id: request})
    result.acknowledged ? res.json(await Pref.find<PrefType>({userSub: res.locals.sub})) : res.sendStatus(404) 
})


export default router