import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (filePath) => {
    try {
        if (!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "image"
        });

        console.log("Image uploaded successfully !!", result.secure_url);
        return result;
    } catch (error) {
        console.log("Image upload failed !!", error.message);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return null;
    }
};

export { uploadImage };