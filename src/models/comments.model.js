import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        require:true,

    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
         type:Schema.Typr.ObjectId,
         ref:"User"
    }

},
{
    timestamps:true
})

export const Comments = mongoose.model("Comment",commentSchema)