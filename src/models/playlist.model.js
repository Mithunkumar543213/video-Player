import mongoose, { Schema } from "mongoose";

const playlistSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trime:true
        
    },
    description:{
        type:true,
        require:true,
        trime:true
    },
    videos:{
        type:Schema.Types.ObjectId, 
        ref:"video"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
}
)


export const playlist =mongoose.model("playlist",playlistSchema)