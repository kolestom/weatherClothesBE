import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { City, CityType } from "../models/CitySchema";
import { User, UserType } from "../models/UserSchema";
import authMW from "../middleWares/authMW";

const router = express.Router();

    const CityReqSchema = z.object({
        city: z.string(),
        country: z.string(),
        lat: z.number().optional(),
        lon: z.number().optional()
    })

    type CityReqSchemaType = z.infer<typeof CityReqSchema>

router.get('/', authMW,async (req: Request, res: Response) =>{
    const favCities = await City.find<CityType>({userSubs:res.locals.sub})
    res.send(favCities)
})

router.post('/', verifyReqSchema(CityReqSchema), authMW,async (req: Request, res: Response) =>{
    const request:CityReqSchemaType = req.body
    
    const user = await User.findOne<UserType>({sub: res.locals.sub})
    if (!user) return res.sendStatus(401)
    
    const [city] = await City.find({cityName: request.city})
    if(!city) {
        const newCity = await City.create<CityType>({
            city: request.city,
            country: request.country,
            lat: request.lat,
            lon: request.lon,
            userSubs: [res.locals.sub]
        })
        if (!newCity) return res.sendStatus(401)
        return res.send(await City.find<CityType>({userSubs:res.locals.sub}))
    }
    if(city.userSubs.includes(res.locals.sub)) return res.status(200).json("city has already been set as a favorite")
    city.userSubs.push(res.locals.sub)
    await city.save()
    const favCities = await City.find<CityType>({userSubs:res.locals.sub}) 
    res.send(favCities)

})

router.delete('/:id', authMW, async (req: Request, res: Response) =>{
    
    const user = await User.findOne({sub: res.locals.sub})
    if (!user) return res.sendStatus(401)
    const _id:string = req.params.id
    const city = await City.findByIdAndUpdate<CityType>(_id, {$pull: {userSubs: user.sub}}, {new: true})
    if (!city?.userSubs.length) await City.deleteOne({_id})
    const favCities = await City.find<CityType>({userSubs:res.locals.sub})
    res.send(favCities)

})

export default router