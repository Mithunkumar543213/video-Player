import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";

const app = express();
app.use(express.json({limit:"70mb"}));   //for body json data
app.use(express.urlencoded({extended:true}));  //for url data
app.use(express.static("public"));   //to serve static folder data
app.use(cookieParser());     //to set or excess user browser cookie

app.use(cors({
    origin:"https://videotube-sage.vercel.app",
    credentials: true,
    })
)
app.use(morgan("dev")) //HTTP request logger middleware for node.js 

// all the router import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import commentRouter from "./routes/comment.routes.js"



// routes decleartion
app.use("/", (req, res) => {
    res.send("API is working fine Mithun")
})
app.use("/api/v1/users",userRouter) 
//http://localhost:8000/api/v1/users/register

app.use("/api/v1/video",videoRouter)
//http:localhost:8000/api/v1/videos/-->

app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/comment",commentRouter)

export { app }