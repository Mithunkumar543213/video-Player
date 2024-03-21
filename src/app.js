import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express();
app.use(express.json({limit:"20kb"}));   //for body json data
app.use(express.urlencoded({extended:true}));  //for url data
app.use(express.static("public"));   //to serve static folder data
app.use(cookieParser());     //to set or excess user browser cookie

app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

//routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"

app.use("/api/v1/user",userRouter) 
//http://localhost:8000/api/v1/users/register

app.use("/api/v1/videos",videoRouter)
//http:localhost:8000/api/v1/videos/-->

export { app }