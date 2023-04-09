import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import axios from "axios";
import { safeParseFc } from "../util/safeParseFc";
import { TypeOf, z } from "zod";
import { env } from "../util/envParser";
const router =express.Router()

const WeatherReqSchema = z.object({
    city: z.string(),
    country: z.string()
})

type ApiResponseType = {
    data: {
        current: {},
        forecast: {},
        location: {}
    }
}

router.post("/", verifyReqSchema(WeatherReqSchema), async(req: Request, res: Response) =>{
    const apiResponse = await axios.get<ApiResponseType>(`https://api.weatherapi.com/v1/forecast.json?key=${env.WEATHER_API_KEY}&q=${req.body.city}+${req.body.country}&days=5&lang=en`)
    if (!apiResponse) res.sendStatus(502)
    res.send(apiResponse.data)  
})

export default router