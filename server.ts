import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
// import { env } from "./util/envParser";
const port = 'mongodb+srv://hospitalsDB:hospitalsDB2023@hospital.shz8y3u.mongodb.net/WeatherClothesAPI'
// mongoose.connect(env.MONGO_URL)
mongoose.connect(port)
.then(()=>console.log("MongoDB online"))
// .then(() => app.listen(env.PORT, ()=> console.log(`Server is running on port ${env.PORT} for WeatherClothesAPI`)))
.then(() => app.listen(port, ()=> console.log(`Server is running on port ${port} for WeatherClothesAPI`)))