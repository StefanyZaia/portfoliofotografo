import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim().replace(/^"|"$/g, "");

  if (!cloudinaryUrl) {
    return {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    };
  }

  const url = new URL(cloudinaryUrl);

  return {
    cloud_name: url.hostname,
    api_key: decodeURIComponent(url.username),
    api_secret: decodeURIComponent(url.password),
    secure: true,
  };
}

try {
  cloudinary.config(getCloudinaryConfig());
} catch (error) {
  console.error("Erro ao configurar Cloudinary:", error.message);
  cloudinary.config({
    secure: true,
  });
}

export function uploadBufferToCloudinary(fileBuffer, folder = "portfoliofotografo") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}
