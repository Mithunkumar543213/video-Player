import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser =asyncHandler(async(req,res)=>{

//----------------All the condition for regitration-----------------
//get user deatail from from frontant
//validation - not enpty
//check if user is already exist  - username , email
//check for image or avatar
//upload them to cloudinary-avter
//create user object  - create enter in db
//remove password and token from response
//check for user creation 
//return res
//--------------------------------------------------------------------


const {username,email,fullName,password}=  req.body;


// if(username===""){                             
//     throw new ApiError(400,"please enter the name"); 
//}       
//-------------------------------------------------------
//we can also check the all field in same way 
//for all the field we have to write same code multiple time
// }
//--------------------------------------------------------


if([username,email,fullName,password].some((field)=>
field?.trim()==="")
){
    throw new ApiError(400,"All field are require"); 
}
})

const existedUser = User.findOne({
    $or:[{email},{username}]
})

if(existedUser){
   throw new ApiError (409,"username or email already exists ")
}

const avatarLocalPath = req.files?.avatar[0];
const coverImageLocalPath = req.files?.coverImage[0];

if(!avatarLocalPath){
    throw new ApiError(400,"Avater image is require")
}

const avatar=await uploadOnCloudinary(avatarLocalPath);
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

const User= await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage:coverImage?.url || ""
})

const createdUser = await User.findById(User._Id).select("-password -refreshToken")

if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"user registerd successfuly")
)



export {registerUser}