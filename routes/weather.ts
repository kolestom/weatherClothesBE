import express, { Request, Response } from "express";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import axios from "axios";
import { z } from "zod";
import { env } from "../util/envParser";
const router =express.Router()

const WeatherReqSchema = z.object({
    city: z.string(),
    country: z.string()
})


router.post("/", verifyReqSchema(WeatherReqSchema), async(req: Request, res: Response) =>{
    try {
        
        const apiResponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${env.WEATHER_API_KEY}&q=${req.body.city}+${req.body.country}&days=5&lang=en`)
        
        // if (!apiResponse) return res.sendStatus(502)
        res.send(apiResponse.data)  
    } catch (error: any) {
        console.log(error.message);
        res.sendStatus(502)
    }
})

export default router