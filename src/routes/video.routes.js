import { Router } from "express";
import {publishAVideo,updateVideo} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/loggedOut.js";


const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router
//     .route("/")
//     .get(getAllVideos)
//     .post(
//         upload.fields([
//             {
//                 name: "videoFile",
//                 maxCount: 1,
//             },
//             {
//                 name: "thumbnail",
//                 maxCount: 1,
//             },
            
//         ]),
//         publishAVideo
//     );


router.route("/upload-video").post(upload.fields([
        {
            name:"videoFile",
            maxCount:1
    },
      {
        name:"thumbnail",
        maxCount:1
      }
]),publishAVideo)

router.route("/update-video").post(upload.single("videoFile"),updateVideo)




export default router