import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { env } from "../util/envParser";
import { City, CityType } from "../models/CitySchema";
import { User, UserType } from "../models/UserSchema";

const router = express.Router();

    const CityReqSchema = z.object({
        cityName: z.string(),
        country: z.string(),
        lat: z.number().optional(),
        lon: z.number().optional(),
        userSub: z.number()
    })

    type CityReqSchemaType = z.infer<typeof CityReqSchema>

router.post('/', verifyReqSchema(CityReqSchema), async (req: Request, res: Response) =>{
    const request:CityReqSchemaType = req.body
    
    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    
    const [city] = await City.find({cityName: request.cityName})
    if(!city) {
        const newCity = await City.create<CityType>({
            cityName: request.cityName,
            country: request.country,
            lat: request.lat,
            lon: request.lon,
            userSubs: [request.userSub],
            // userSubs: [res.locals.sub]
        })
        if (!newCity) return res.sendStatus(401)
        return res.send(await City.find({userSubs:request.userSub}))
    }
    city.userSubs.push(request.userSub)
    city.save()
    res.send(await City.find({userSubs:request.userSub}))

})

router.delete('/:id', async (req: Request, res: Response) =>{
    const [user] = await User.find<UserType>()
    // const user = await User.findOne({sub: res.locals.sub})
    // if (!user) return res.sendStatus(401)
    const _id:string = req.params.id
    const city = await City.findByIdAndUpdate<CityType>(_id, {$pull: {userSubs: user.sub}}, {new: true})
    if (!city?.userSubs.length) await City.deleteOne({_id})

    res.send(await City.find({userSubs:user.sub}))

    // result.acknowledged ? res.json(result.acknowledged) : res.sendStatus(503) 
})

export default router