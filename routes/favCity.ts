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
    const user = await User.findOne({sub: res.locals.sub})
    const favCities = await City.find({_id: {$in: user?.cities}})
    res.send(favCities)
})

router.post('/', authMW, verifyReqSchema(CityReqSchema), async (req: Request, res: Response) =>{
    const request:CityReqSchemaType = req.body
    
    const user = await User.findOne({sub: res.locals.sub})
    if (!user) return res.sendStatus(401)
    
    const [city] = await City.find({$and: [{lat: request.lat}, {lon: request.lon}]})
    
    if(!city) {
        const newCity = await City.create<CityType>({
            city: request.city,
            country: request.country,
            lat: request.lat,
            lon: request.lon
        })
        if (!newCity) return res.sendStatus(401)
        user.cities.push(newCity._id)
        await user.save()
        const favCities = await City.find({_id: {$in: user.cities}})
        return res.send(favCities)
    }

    if(user.cities.includes(city._id)) return res.status(200).json("city has already been set as a favorite")
    user.cities.push(city._id)
    await user.save()
    const favCities = await City.find({_id: {$in: user.cities}})
    res.send(favCities)

})

router.delete('/:id', authMW, async (req: Request, res: Response) =>{
    
    const city = await City.findById(req.params.id)
    if (!city) return res.status(400).json("City not found")
    
    const updatedUser = await User.findOneAndUpdate({sub: res.locals.sub}, {$pull: {cities: city._id}}, {new: true})
    const cityUsers = await User.find({cities: {$elemMatch: {_id: city._id}}})
    if (!cityUsers.length) {
        await city.deleteOne()
    }
    
    const favCities = await City.find({_id: {$in: updatedUser?.cities}})
    res.send(favCities)

})

export default router