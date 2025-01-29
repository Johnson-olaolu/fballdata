import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/errorHandler";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../config";
// import { Readable } from 'stream';

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      // const upload =
      cloudinary.uploader
        .upload_stream(
          {
            folder: "",
          },
          (error, response) => {
            if (error) reject(error);
            return resolve(response);
          }
        )
        .end(file.buffer);
    })
      .then((response: unknown) => {
        const uploadResponse = response as UploadApiResponse;
        return uploadResponse;
      })
      .catch((error: UploadApiErrorResponse) => {
        throw new AppError("");
      });
  }

  async delete(cloudinaryPublicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .destroy(cloudinaryPublicId)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default new CloudinaryService();
