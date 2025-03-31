import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const genrateAccessTokenAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.genrateAccessToken(); //genrating access token

    const refreshToken = user.genrateRefreshToken(); //genrating refresh token

    user.refreshToken = refreshToken; //create object of refresh token to save data base
    await user.save({ validateBeforeSave: false }); // save refresh token token in data base

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went wrong while generating refresh and access token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //----------------All the condition for regitration-----------------
  //get user deatail from frontant
  //validation - not empty
  //check if user is already exist  - username , email
  //check for image or avatar
  //upload them to cloudinary-avter
  //create user object  - create entery in db
  //remove password and token from response
  //check for user creation
  //return res
  //--------------------------------------------------------------------

  const { username, email, fullName, password } = req.body; //get user deatail from from frontant
 console.log(req.body)
   // if(username===""){
  //     throw new ApiError(400,"please enter the name");
  //}
  //------------------------------------------------------------------
  //we can also check the all field in same way
  //for all the field we have to write same code multiple time

  //-----------------------we can do same work using loop -------------

  // // Loop through the array  --> we have also add all the in array
  // for (let i = 0; i < usernames.length; i++) {
  //     const username = usernames[i];

  //     // Check if the username is empty
  //     if (username === "") {
  //         // If the username is empty, throw an error
  //         throw new ApiError(400, "Please enter a name");
  //     }
  // }
  //----------------------------------------------------------------

  //this all can be done in sigle code
  //check the username ,email and password in enterd by user or not

  if (
    [username, email, fullName, password].some(
      (field ) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are require");
  }

  const existedUser = await User.findOne({
    //find the user by email and username ,we can also  find any one of the vale
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    console.log(existedUser); throw new ApiError(409, "Username or email already exists ");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avater image is require");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);//upload avater on cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);// upload coverImage on clodinary

  if (!avatar) {
    throw new ApiError(400, "Avater file is required");
  }


  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar:{
       url:avatar.url,
       public_id:avatar.public_id
    } ,
    coverImage: {
      url:coverImage?.url ,
      public_id:coverImage?.public_id
    } || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user! ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registerd successfuly"));
});

const logUser = asyncHandler(async (req, res) => {
  //take req from body-> data
  //username or email
  //find the user
  //check  password
  //access and referesh token
  //send cookie
  //allow the user to excess

  const { username, email, password } = req.body;
  console.log(username)

  if (!(email || username)) {
    throw new ApiError(400, "Please enter the emailId or username");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User does not exises");
  }

  const ispasswordVaild = await user.isPasswordCorrect(password);

  if (!ispasswordVaild) {
    throw new ApiError(404, "Invailed email or password");
  }

  const { accessToken, refreshToken } =
    await genrateAccessTokenAndRefereshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(   //removwe the password and refress token from       the     response
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logIn Successfully"
      )
    );
});

// logout controoler
const loggedOut = asyncHandler(async (req, res) => {                               
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this remove the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refereshAccessToken = asyncHandler(async (req, res) => {
  //this is the controller of that end point where user can refresh your expair access token and refresh token
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken; //req.body.refreshToken for mobile device or which browser not support cookies like safari,firefox,Brave
 
  console.log(incomingRefreshToken)

  if (!incomingRefreshToken) {
    throw new ApiError(402, "Access token not found");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedRefreshToken) {
      throw new ApiError(401, "Invailed Refresh token");
    }

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(402, "Invailed User");
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token expaired are used");
    }

    const { accessToken, newRefreshToken } =
      await genrateAccessTokenAndRefereshToken(user?._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "New Refresh token genrated"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Unable to genrate refrash token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unable to excess the user ");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(402, "Invaild old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password is changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User get successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(401, "please enter the fullName and email");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account deatail updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(402, "error while uploading the avatar");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
}

const user = await User.findById(req.user._id).select("avatar");
const avatarToDelete = user.avatar.public_id;
const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: {
          public_id:avatar.public_id,
          url:avatar.url
        }
      },
    },
    { new: true }
  ).select("-password");

  if (avatarToDelete && updatedUser.avatar.public_id) {
    await deleteOnCloudinary(avatarToDelete);
}

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avater is Updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(402, "please reuploade the cover image");
  }

  const user = await User.findById(req.user._id).select("coverImage");
  const coverImageToDelete = user.coverImage.public_id;

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(400, "error while uploading on cloudinary");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: {
          public_id:coverImage.public_id,
          url:coverImage.url
        },
      },
    },
    { new: true }
  );

  // delete the old cover image from cloudanary
  if (coverImageToDelete  && updatedUser.coverImage.public_id) {
    await deleteOnCloudinary(coverImageToDelete);
}
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser , "cover image update successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: { 
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  logUser,
  loggedOut,
  refereshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
