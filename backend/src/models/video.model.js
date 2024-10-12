import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";

const videoSchema=new mongoose.Schema({
        videoFile:{
            type: {
                url: String,
                public_id: String,
            },
            required: true,
        },
        thumbnail:{
            type: {
                url: String,
                public_id: String,
            },
            required: true,
        },
        title:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        duration:{
            type:Number,
            require:true,
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owenar:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

},{
    timestamps:true
});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema);