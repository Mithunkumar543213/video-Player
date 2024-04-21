import mongoose,{Schema} from "mongoose";

const tweetSchema=new mongoose.Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
   contant: {
        type:String,
        trim:true
    }

},{
    timestamps:true
})

const Tweet=mongoose.model("Tweet",tweetSchema)