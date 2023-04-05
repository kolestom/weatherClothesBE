import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
import { env } from "./util/envParser";

mongoose.connect(env.MONGO_URL)
.then(()=>console.log("MongoDB online"))
.then(() => app.listen(env.PORT, ()=> console.log(`Server is running on port ${env.PORT} for WeatherClothesAPI`)))