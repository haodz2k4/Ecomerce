import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

interface UploadResult {
  url: string;
  [key: string]: any; 
}
let streamUpload = (buffer: Buffer): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto"
      },
      (error, result) => {
        if (result) {
          resolve(result as UploadResult);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  let result = await streamUpload(buffer);
  return result.url;
};