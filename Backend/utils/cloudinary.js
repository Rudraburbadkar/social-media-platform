import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true});

const uploadOnCloudinary = async (filepath) =>{
    try {
        if(!filepath){
            return null;
        }
        const result = await cloudinary.uploader.upload(filepath,{
            resource_type: "auto",
            folder: "social-media"

        })
        console.log("File uploaded to Cloudinary:", result.secure_url);
        fs.unlinkSync(filepath);
        return result;
        

    } catch (error) {
        console.error("cloudinary upload error", error);
        fs.unlinkSync(filepath);
        return null;
    }
}

export default uploadOnCloudinary