import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";


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
        ref:"Video"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
}
)

playlistSchema.plugin(mongooseAggregatePaginate)


export const playlist =mongoose.model("playlist",playlistSchema)