// Service layer for media management - handles business logic and interactions with Cloudinary
import {
    ImageAsset,
    UploadResponse,
    DeleteResponse,
} from "@/types/media";
import {
    uploadImage,
    deleteImage,
    replaceImage,
    getFolderImages,
} from "./cloudinary";
import { validateImageUpload } from "./validations";
import { getSectionConfig } from "./media.config";

export const getMediaAssets = async (
    companyId: string,
    sectionId: string
): Promise<ImageAsset[]> => {
    if (!companyId || !sectionId) return [];
    const folderPath = `${companyId}/${sectionId}`;
    try {
        return await getFolderImages(folderPath);
    } catch (error) {
        console.error(`Failed to get images for folder ${folderPath}:`, error);
        return [];
    }
};

export const handleImageUpload = async (
    companyId: string,
    sectionId: string,
    files: File[],
    currentImages: ImageAsset[]
): Promise<UploadResponse[]> => {
    const sectionConfig = getSectionConfig(companyId, sectionId);
    if (!sectionConfig) {
        return [{ success: false, message: "Section configuration not found." }];
    }

    const { errors, validFiles } = validateImageUpload(
        files,
        currentImages.length,
        sectionConfig
    );

    const validationErrorResponses: UploadResponse[] = errors.map((error) => ({
        success: false,
        message: error,
    }));

    const uploadPromises = validFiles.map(async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const folder = `${companyId}/${sectionId}`;
            const publicId = `${folder}/${file.name.split(".").slice(0, -1).join(".")}`;

            const asset = await uploadImage(buffer, folder, publicId);
            return {
                success: true,
                message: `${file.name} uploaded successfully.`,
                asset,
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to upload ${file.name}.`,
                error: error.message,
            };
        }
    });

    return [...validationErrorResponses, ...(await Promise.all(uploadPromises))];
};

export const handleImageDelete = async (
    publicIds: string[]
): Promise<DeleteResponse[]> => {
    const deletePromises = publicIds.map(async (publicId) => {
        try {
            await deleteImage(publicId);
            return { success: true, message: `Image deleted successfully.` };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to delete ${publicId}.`,
                error: error.message,
            };
        }
    });
    return Promise.all(deletePromises);
};

export const handleImageReplace = async (
    oldPublicId: string,
    newFile: File
): Promise<UploadResponse> => {
    try {
        const arrayBuffer = await newFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await replaceImage(oldPublicId, buffer);

        return {
            success: true,
            message: "Image replaced successfully.",
            asset,
        };
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to replace image.",
            error: error.message,
        };
    }
};