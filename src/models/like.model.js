import mongoose ,{ Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    comment:{
         type:Schema.Types.ObjectId,
         ref:"comments"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"tweets"
    }

},{
    timestamps:true
})

export const like= mongoose.model("like",likeSchema)