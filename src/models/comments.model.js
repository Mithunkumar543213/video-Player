import mongoose, { Schema } from "mongoose";

const commentSchema= new mongoose.Schema({
    content:{
        type:String,
        require:true,

    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"videos"
    },
    owner:{
         type:Schema.Typr.ObjectId,
         ref:"users"
    }

},
{
    timestamps:true
})

export const comments=mongoose.model("comment",commentSchema)