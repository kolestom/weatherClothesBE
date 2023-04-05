import express, { Express, Request, Response } from "express";
import login from "./routes/login"
import prefs from './routes/prefs'
import cors from 'cors'

const app: Express = express();


app.use(cors())
app.use(express.json());
app.use('/api/login', login)
app.use('/api/prefs', prefs)


export default app