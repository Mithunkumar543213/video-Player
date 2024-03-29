import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary ,metaDataOnCloudinary} from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  //Define your aggregation pipeline stages
  const pipeline = [];
  
  // Match stage to filter based on userId or any other criteria if needed
  if (userId) {
    pipeline.push({ $match: { owenar: userId } });
  }
  
  // Add projection stage to include only videoFile and thumbnail fields
  pipeline.push({ $project: { videoFile: 1, thumbnail: 1, _id: 0 } });
  
  // Optionally, add sorting stage based on sortBy and sortType
  if (sortBy && sortType) {
    const sortField = sortBy === 'videoFile' || sortBy === 'thumbnail' ? sortBy : 'createdAt'; // Assuming createdAt as default
    const sortOrder = sortType === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }
  
  // Paginate the results using mongooseAggregatePaginate
  Video.aggregatePaginate(pipeline, { page: parseInt(page), limit: parseInt(limit) }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(result);
  });

});

const publishAVideo = asyncHandler(async (req, res) => {
    console.log("enter in publishAVideo")
  const { title, description } = req.body;
  if (!(title || description)) {
    throw new ApiError(402, "title and description is required");
  }

//   const user = req.user._id;

//   if (!user) {
//     throw new ApiError(400, "user is not vaild to upload video");
//   }

  // TODO: get video, upload to cloudinary, create video

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;

  if (!(videoFileLocalPath || thumbnailLocalPath)) {
    throw new ApiError(402, "Unable to get localPath of video or thumbnail ");
  }

  const video = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!(video || thumbnail)) {
    throw new ApiError(400, "video and thumbnail is not uplod on cloudnary");
  }
  
// Retrieve video metadata from Cloudinary to get the duration
// const videoMetadata = await metaDataOnCloudinary(video.public_id);
// if (!videoMetadata) {
//     throw new ApiError(400, "Unable to get information about the uploaded video");
// }

// console.log(videoMetadata)

  const videoObject = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    owenar:req.user._id,
    // duration:durationInMinutes
  })
  const createdVideo = await Video.findById(videoObject._id)
  

  if (!createdVideo) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "video is uploaded successfuly successfuly"));


});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videoFileLocalPath = req.file?.path


  
  //TODO: get video by id


});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

if(!videoId){
  throw new ApiError(400,"videoId is not found");
}

const videoSchema= await Video.findById(videoId)

  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});



export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
