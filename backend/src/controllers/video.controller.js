import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import{ Comment} from"../models/comments.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary ,deleteOnCloudinary} from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  console.log({ page, limit, query, sortBy, sortType, userId });
  // get all videos based on query, sort, pagination
  //Define your aggregation pipeline stages
  const pipeline = [];
  // for using Full Text based search you need to create a search index in mongoDB atlas
    // you can include field mapppings in search index eg.title, description, as well
    // Field mappings specify which fields within your documents should be indexed for text search.
    // this helps in seraching only in title, desc providing faster search results
    // here the name of search index is 'search-videos'

    if (query) {
      pipeline.push({
          $search: {
              index: "search-videos",
              text: {
                  query: query,
                  path: ["title", "description"] //search only on title, desc
              }
          }
      });
  }  
  // Match stage to filter based on userId or any other criteria if needed
  if (userId) {
    if(!isValidObjectId(userId)){
      throw new ApiError(400,'invaild userId')
    }
    pipeline.push({ $match: {  owner: userId } });
  }
  

//fetch video only video that is set as published as true

pipeline.push({$match:{isPublished:true}})

  
    //sortBy can be views, createdAt, duration
    //sortType can be ascending(-1) or descending(1)
    if (sortBy && sortType) {
      pipeline.push({
          $sort: {
              [sortBy]: sortType === "asc" ? 1 : -1
          }
      });
  } else {
      pipeline.push({ $sort: { createdAt: -1 } });
  }

  pipeline.push(
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
                          "avatar.url": 1
                      }
                  }
              ]
          }
      },
      {
          $unwind: "$ownerDetails"
      }
  )
  
  // Paginate the results using mongooseAggregatePaginate
  const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const {title,description}=req.body;
    console.log({title,description})

  
    if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "title and description is required");
  }
  //get video, upload to cloudinary, create video

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;

  console.log(videoFileLocalPath,thumbnailLocalPath)

  if (!(videoFileLocalPath || thumbnailLocalPath)) {
    throw new ApiError(402, "Unable to get localPath of video or thumbnail ");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);


  if (!(videoFile && thumbnailFile)) {
    throw new ApiError(400, "video and thumbnail is not able to upload on cloudnary");
  }
  
// Retrieve video metadata from Cloudinary to get the duration
// const videoMetadata = await metaDataOnCloudinary(videoFile.public_id);
// if (!videoMetadata) {
//     throw new ApiError(400, "Unable to get information about the uploaded video");
// }

// console.log(videoMetadata)
console.log(req.user?._id)

  const videoObject = await Video.create({
        title,
        description,
        duration:videoFile.duration.toFixed(2) ,
        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id
        },
        thumbnail: {
            url: thumbnailFile.url,
            public_id: thumbnailFile.public_id
        },
        owner: req.user?._id,
        isPublished: false
  });
  console.log(videoObject)
  const createdVideo = await Video.findById(videoObject._id)

  

  if (!createdVideo) {
    throw new ApiError(500, "upload faild please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "video is uploaded successfuly successfuly"));


});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  // userId = new mongoose.Types.ObjectId(userId)
  if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
  }

  if (!isValidObjectId(req.user?._id)) {
      throw new ApiError(400, "Invalid userId");
  }

  const video = await Video.aggregate([
      {
          $match: {
              _id: new mongoose.Types.ObjectId(videoId)
          }
      },
      {
          $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "video",
              as: "likes"
          }
      },
      {
          $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                  {
                      $lookup: {
                          from: "subscriptions",
                          localField: "_id",
                          foreignField: "channel",
                          as: "subscribers"
                      }
                  },
                  {
                      $addFields: {
                          subscribersCount: {
                              $size: "$subscribers"
                          },
                          isSubscribed: {
                              $cond: {
                                  if: {
                                      $in: [
                                          req.user?._id,
                                          "$subscribers.subscriber"
                                      ]
                                  },
                                  then: true,
                                  else: false
                              }
                          }
                      }
                  },
                  {
                      $project: {
                          username: 1,
                          "avatar.url": 1,
                          subscribersCount: 1,
                          isSubscribed: 1
                      }
                  }
              ]
          }
      },
      {
          $addFields: {
              likesCount: {
                  $size: "$likes"
              },
              owner: {
                  $first: "$owner"
              },
              isLiked: {
                  $cond: {
                      if: {$in: [req.user?._id, "$likes.likedBy"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              "videoFile.url": 1,
              title: 1,
              description: 1,
              views: 1,
              createdAt: 1,
              duration: 1,
              comments: 1,
              owner: 1,
              likesCount: 1,
              isLiked: 1
          }
      }
  ]);

  if (!video) {
      throw new ApiError(500, "failed to fetch video");
  }

  // increment views if video fetched successfully
  await Video.findByIdAndUpdate(videoId, {
      $inc: {
          views: 1
      }
  });

  // add this video to user watch history
  await User.findByIdAndUpdate(req.user?._id, {
      $addToSet: {
          watchHistory: videoId
      }
  });

  return res
      .status(200)
      .json(
          new ApiResponse(200, video[0], "video details fetched successfully")
      );
});


const updateVideo = asyncHandler(async (req, res) => {
  const{title,description}=req.boby;
  const { videoId } = req.params;

  if(!isValidObjectId(videoId)){
    throw new ApiError('400',"Invaild ")
  }

if(!(title || description)){
  throw new ApiError(400,"unable to tittle aand description")
}


const video= await Video.findById(videoId)

if(!videoSchema){
  throw new ApiError(400,'unable to get videoSchema')
}

  //update video details like title, description, thumbnail
//check user can only edit the video
  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
        400,
        "You can't edit this video as you are not the owner"
    );
}

//delete the previous thumbnail
const thumbnailToDelete = video.thumbnail.public_id;

const thumbnailLocalPath=req.files?.thumbnail[0]?.path

if(!thumbnailLocalPath){
  throw new ApiError(400,"unable to get local path of thumbnal")
}

const thumbnailFile=await uploadOnCloudinary(thumbnailLocalPath)

if(!thumbnailFile){
  throw new ApiError(400,'unable to upload thumbnail on cloudinary')
}

const updatedVideo = await Video.findByIdAndUpdate(
  videoId,
  {
      $set: {
          title,
          description,
          thumbnail: {
              public_id: thumbnailFile.public_id,
              url: thumbnailFile.url
          }
      }
  },
  { new: true }
);

if(!updatedVideo){
  throw new ApiError(400, "unable to update data on database")
}

if (updatedVideo) {
  await deleteOnCloudinary(thumbnailToDelete);
}

return res
        .status(200)
        .json(
          new ApiResponse(200,updatedVideo ,"video is updated succesfully")
        )

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if(!isValidObjectId){
    throw new ApiError(400,"invalid video id")
  }
  const video= await Video.findById(videoId)

if(!video){
  throw new ApiError(400,"unable to find videoschma")
}
  //delete video

  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
        400,
        "You can't edit this video as you are not the owner"
    );
}
const videoDeleted = await Video.findByIdAndDelete(video?._id);

if(!videoDeleted){
  throw new ApiError(400,"unable to get the video which we want to delete")
}

await deleteOnCloudinary(video.thumbnail.public_id);
await deleteOnCloudinary(video.videoFile.public_id);

await Like.deleteMany({
  video: videoId
})

// delete video comments
await Comment.deleteMany({
  video: videoId,
})

return res
          .status(200)
          .json( new ApiResponse(200,{},"video is deleted successfuly"))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;


  if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
      throw new ApiError(404, "Video not found");
  }

  if (video?.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(
          400,
          "You can't toogle publish status as you are not the owner"
      );
  }

  const toggledVideoPublish = await Video.findByIdAndUpdate(
      videoId,
      {
          $set: {
              isPublished: !video?.isPublished
          }
      },
      { new: true }
  );

  if (!toggledVideoPublish) {
      throw new ApiError(500, "Failed to toogle video publish status");
  }

  return res
      .status(200)
      .json(
          new ApiResponse(
              200,
              { isPublished: toggledVideoPublish.isPublished },
              "Video publish toggled successfully"
          )
      );
});



export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
