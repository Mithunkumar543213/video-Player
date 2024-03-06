import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const genrateAccessTokenAndRefereshToken = async(userId)=>{
    try{
        const user = User.findById(userId);
        const accessToke = user.genrateAccessToken();
        const refreshToken= user.genrateRefreshToken();
        user.refreshToken = refreshToken ;
        await user.save({validateBeforeSave:true});

        return {accessToke,refreshToken}


    }catch(error){
        throw new ApiError(500,"Something Went wrong while generating refresh and access token ")
    }
}

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


const existedUser =await User.findOne({
    $or:[{email},{username}]
})

if(existedUser){
   throw new ApiError (409,"username or email already exists ")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;
let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

if(!avatarLocalPath){
    throw new ApiError(400,"Avater image is require")
}

const avatar=await uploadOnCloudinary(avatarLocalPath);
const coverImage=await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400,"Avater file is required")
}

const user= await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage:coverImage?.url || ""
})

const createdUser = await User.findById(user._id).select("-password -refreshToken")

if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"user registerd successfuly")
)

})

const loginUser = asyncHandler(async(req,res)=>{
    //take req from body-> data
    //username or email
    //find the user
    //check  password
    //access and referesh token
    //send cookie
    //allow the user the excess


    const {username,email,password} = req.body ;

    if(!(email || username)){
        throw new ApiError(400,"Please enter the emailId") ;
    }

    const user = await  User.findOne({
    $or:[{username},{email}]    
    })

    if(! user){
        throw new ApiError(401,"User does not exises")
    }

const ispasswordVaild = await user.isPasswordCorrect(password)

if(! ispasswordVaild){
    throw new ApiError(404,"Invailed email or password")
}

const {accessToke,refreshToken} = genrateAccessTokenAndRefereshToken(user._id)

const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

const options={
    httpOnly:true,
    secure: true

}

return res
.status(200)
.cookie("accessToken",accessToke,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:loginUser,accessToke,refreshToken
        },
        "user logIn Successfully"
    )
)

})

export {registerUser,
    loginUser
}