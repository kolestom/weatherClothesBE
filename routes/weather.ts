import express, { Express, Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import axios from "axios";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { env } from "../util/envParser";
const router =express.Router()

const WeatherReqSchema = z.object({
    city: z.string(),
    country: z.string()
})


router.post("/", verifyReqSchema(WeatherReqSchema), async(req: Request, res: Response) =>{
    const apiResponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${env.WEATHER_API_KEY}&q=${req.body.city}+${req.body.country}&days=5&lang=en`)

    //itt is kene safeparse
    if (!apiResponse) return res.sendStatus(502)
    res.send(apiResponse.data)  
})

export default router