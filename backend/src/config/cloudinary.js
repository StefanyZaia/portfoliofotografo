import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  secure: true,
});

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