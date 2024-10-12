import mongoose, { Schema } from "mongoose"
import jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';

const UserSchema =  new mongoose.Schema({
username:{
    type:String,
    required:[true,'username is required'],
    unique:true,
    lowercase:true,
    trim:true,
    index:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},
fullName:{
    type:String,
    required:[true,'fullname is required'], 
    trim:true,
    index:true
},
avatar:{
    type: {
        public_id: String,
        url: String //cloudinary url
    },
    required: true

},
coverImage:{
    type: {
        public_id: String,  // the public_id is adding to perform some opration cloudinary like delete the   image from cloudinary than the public_id is required that is genrated by the cloudinary
        url: String //cloudinary url
    },
    required: true
},
watchHistory:[
    {
        type:Schema.Types.ObjectId,
         ref:"video"
    }
],
password:{
    type:String,
    required:[true,"Password is required"]
},
refreshToken:{
    type:String
}
},{
    timestamps:true
});   

UserSchema.pre("save", async function(next){
// if(!this.isModified("password",)) return next();  //this is also a way to do same work
    if(this.isModified("password",)){
     this.password = await bcrypt.hash(this.password,10)
     return next()
    }
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.genrateAccessToken= function(){                   
    // syntex to  genrate Token
    // jwt.sign({
    //     data: 'foobar'
    //   }, 'secret', { expiresIn: '1h' });

   return jwt.sign({                          
        _id:this._id,               
        email:this.email,
        username:this.username,
        fullName:this.fullName

    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
UserSchema.methods.genrateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
         
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}




export const User=mongoose.model("User",UserSchema);




// model link :  https://app.eraser.io/workspace/NxP7l2agxHiaiXnm1tr9?origin=share