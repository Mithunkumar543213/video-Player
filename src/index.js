// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import express from "express";
const app = express();

dotenv.config({
  path: "./env",
});

app.listen(process.env.PORT, () => {
  console.log(`app is listening on port ${process.env.PORT}`);
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`dataBaseConnectionError:${error}`);
  });
