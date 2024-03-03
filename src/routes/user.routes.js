import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js"

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


export default router