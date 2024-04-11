// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
  path: "./env",
});


// app.listen(process.env.PORT ||8000 , () => {
//   console.log(`app is listening on port ${process.env.PORT}`);
// });



//database connection 
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


