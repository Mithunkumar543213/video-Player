import mongoose,{isValidObjectId} from "mongoose";
import {Subscription} from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    //  toggle subscription


if(!isValidObjectId(channelId)){
    throw new ApiError(400,'this is not vaild channelId')
}


const isSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
});

if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed?._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { subscribed: false },
                "unsunscribed successfully"
            )
        );

    

}

await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
});

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId){
        throw new ApiError(400,"")
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}