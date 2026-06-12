import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { ImageAsset } from "@/types/media";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadImage = async (
    fileBuffer: Buffer,
    folder: string,
    publicId?: string,
    overwrite: boolean = false
): Promise<ImageAsset> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                overwrite: overwrite,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result)
                    return reject(new Error("Cloudinary upload failed with no result."));
                // The result object from upload_stream is slightly different, so we map it to our ImageAsset type
                const asset: ImageAsset = {
                    ...result,
                    original_filename: result.original_filename || "",
                };
                resolve(asset);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export const deleteImage = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

export const replaceImage = async (
    oldPublicId: string,
    newFileBuffer: Buffer
): Promise<ImageAsset> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: oldPublicId,
                overwrite: true,
                invalidate: true,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);

                if (!result) {
                    return reject(
                        new Error("Cloudinary replace failed.")
                    );
                }

                resolve({
                    ...result,
                    original_filename:
                        result.original_filename || "",
                } as ImageAsset);
            }
        );

        uploadStream.end(newFileBuffer);
    });
};

export const getFolderImages = async (
    folderPath: string
): Promise<ImageAsset[]> => {
    // Using the Admin API (.api.resources) bypasses the 3-second search indexing delay,
    // guaranteeing instantly consistent results right after an upload!
    const result = await cloudinary.api.resources({
        type: "upload",
        prefix: folderPath + "/", // The trailing slash ensures we only get files IN this folder
        max_results: 500,
        direction: "asc" // Sort ascending
    });

    return result.resources as ImageAsset[];
};

export const createFolder = async (folderPath: string): Promise<void> => {
    // Cloudinary automatically creates folders on upload.
    // This function can be used to explicitly create an empty folder if needed.
    try {
        await cloudinary.api.create_folder(folderPath);
    } catch (error: any) {
        // Ignore error if folder already exists
        if (error.http_code !== 409) {
            throw error;
        }
    }
};

export const deleteFolder = async (folderPath: string): Promise<void> => {
    await cloudinary.api.delete_folder(folderPath);
};