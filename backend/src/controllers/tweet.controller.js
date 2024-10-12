import mongoose,{isValidObjectId} from "mongoose";
import {Tweet} from "../models/video.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content} =req.body;
    if(!content){
        throw new ApiError(400,'unable to get tweet content')
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user?._id,
    });

    if(!tweet){
        throw new ApiResponse(500,'faild create tweet please try again')
    }

    return res
             .status(200)
             .Json(new ApiResponse(200,tweet,'tweet is send succesfuly'))

});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} =req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeDetails",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likeDetails",
                },
                ownerDetails: {
                    $first: "$ownerDetails",
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likeDetails.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                ownerDetails: 1,
                likesCount: 1,
                createdAt: 1,
                isLiked: 1
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
const{ content} =req.boby
const {tweetId}=req.params

if(!content){
    throw new ApiError(400,' tweet content not fetch')
}

if(!isValidObjectId(tweetId)){
    throw new ApiError(400,'unable to get the tweetId')
}

const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }


if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "only owner can edit thier tweet");
}

const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set:{
            content
        }
    },
    {new :true }
);

if(!updatedTweet){
    throw new ApiError(400,'unablew to update tweet please try again')
}

return res
        .status(200)
        .json(new ApiResponse(200,'updatedTweet,tweet is updated succesfully'))



})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400,'unable to get tweetId')
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,'unable to get the tweetId')
    }
    
    const tweet = await Tweet.findById(tweetId);
    
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }
    
    
    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit thier tweet");
    }
 
    const deleteTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deleteTweet){
        throw new ApiError(400,'unable to delete the tweet')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {tweetId}, "Tweet deleted successfully"));
}); 





export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}