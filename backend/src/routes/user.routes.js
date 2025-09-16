import { Router } from "express";
import { 
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
  getWatchHistory
} from "../controllers/user.controllers.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(upload.fields([
    {
      name:"avatar",             //this is middleware which is used to parse the file like image,video,pdf etc
                                 //through multer. 
      maxCount:1  
    },
    {
        name:"coverImage",
        maxCount:1
    }
]), registerUser)

router.route("/login").post(logUser)

//secured routes
router.route("/logout").post(verifyJWT,  loggedOut)
router.route("/refresh-token").post(refereshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-user").patch( verifyJWT,updateAccountDetails)
router.route("/change-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-coverImg").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)


export default router
