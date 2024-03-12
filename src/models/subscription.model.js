import mongoose, { Schema } from "mongoose";

const subscriptionSchema= new mongoose.Schema({
    subscriber:{
        type:Schema.Types.ObjectId,   //one who is subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,  //channel who is subscrib the subscriber 
        ref:"User"
    }

},
{
    timestamps:true
})


export const subscription=mongoose.model("subscription",subscriptionSchema)