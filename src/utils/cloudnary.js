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
        const responce=await cloudinary.uploader.upload(localFillePath,{resource_type:'auto'
        })
        //file not uploaded
        // console.log("file is  uploaded", responce.url)
        fs.unlinkSync(localFillePath);
        return responce;
    }catch (error){
        fs.unlink(localFillePath)//remove the locally saved temporray file as the upload opration fot faild
    }
}

const metaDataOnCloudinary = async (public_id) => {
    try {
        if (!public_id) return null;
        const response = await cloudinary.api.resource(public_id, { resource_type:"video" }); // Assuming resource_type is 'video'
        return response;
    } catch (error) {
        console.error("Error fetching metadata from Cloudinary:", error);
        return null;
    }
}

export {uploadOnCloudinary ,metaDataOnCloudinary}
