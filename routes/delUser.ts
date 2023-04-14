import authMW from "../middleWares/authMW";
import { User} from "../models/UserSchema"
import { Pref } from "../models/PrefSchema";
import { City } from "../models/CitySchema";
import { Router, Request, Response } from "express";

const router = Router();

router.delete('/', authMW, async(req: Request, res: Response) =>{

    await Pref.deleteMany({userSub: res.locals.sub})
    const [delUser] = await User.find({sub: res.locals.sub})
    const usedCities = await City.find({_id: {$in: delUser.cities}})
    await delUser.deleteOne()
    usedCities.map(async(city) => {
        const cityUsers = await User.find({cities: {$in: city._id}})
        if (!cityUsers.length) {
            await city.deleteOne()
        }
    })
    res.sendStatus(200)
})

export default router