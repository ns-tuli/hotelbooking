import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);                
console.log(process.env.CLOUDINARY_API_SECRET);

// Cloudinary configuration with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
