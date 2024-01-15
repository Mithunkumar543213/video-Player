// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
  path: "./env",
});

app.listen(process.env.PORT ||8000 , () => {
  console.log(`app is listening on port ${process.env.PORT}`);
});

connectDB()
.then(() => {
  app.on(err,()=>{
    console.log("faild",error);
    throw err
  })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`dataBaseConnectionError:${error}`);
  });
