import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary=async(localFillePath)=>{
    try{
        if(!localFillePath) return null;
        //upload the file on cloudanary
        const responce=await cloudinary.uploader.upload(localFillePath,{    //v2.uploder.upload            resource_type:'auto'
        })
        //file not uploaded
        console.log("file is not uploaded", responce.url)
        return responce;
    }catch (error){
        fs.unlink(localFillePath)//remove the locally saved temporray file as the upload opration fot faild
    }
}

export {uploadOnCloudinary}
