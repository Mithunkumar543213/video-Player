import mongoose ,{ Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    comment:{
         type:Schema.Types.ObjectId,
         ref:"comments"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"tweet"
    }

},{
    timestamps:true
})

export const like= mongoose.model("like",likeSchema)