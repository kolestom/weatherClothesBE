
import mongoose from "mongoose";
import app from "./app";
import { env } from "./util/envParser";

mongoose.connect(env.MONGO_URL)
.then(()=>console.log("MongoDB online"))
.then(() => app.listen(env.SERVER, ()=> console.log(`Server is running on port ${env.SERVER} for WeatherClothesAPI`)))