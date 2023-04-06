import express, { Express, Request, Response } from "express";
import login from "./routes/login"
import pref from './routes/pref'
import favCity from './routes/favCity'
import cors from 'cors'

const app: Express = express();


app.use(cors())
app.use(express.json());
app.use('/api/login', login)
app.use('/api/pref', pref)
app.use('/api/fav_city', favCity)


export default app