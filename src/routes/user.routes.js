import { Router } from "express";
import { registerUser ,loginUser,loggedOut,refereshAccessToken} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/loggedOut.js";

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
]),  registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  loggedOut)

router.route("/refresh-token").post(refereshAccessToken)


export default router