import mongoose,{Schema} from "mongoose";

const tweetSchema=new mongoose.Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
   contant: {
        type:String,
        trim:true
    }

},{
    timestamps:true
})

const tweet=mongoose.model("tweet",tweetSchema)