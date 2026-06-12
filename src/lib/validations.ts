import { z } from "zod";
import { SectionConfig } from "@/types/media";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/config/media.config";

const createFileSchema = (sectionConfig: SectionConfig) => {
    const allowedTypes = sectionConfig.allowedFormats?.length
        ? sectionConfig.allowedFormats.map((format) => {
              if (format === "jpg" || format === "jpeg") {
                  return "image/jpeg";
              }
              return `image/${format}`;
          })
        : ACCEPTED_IMAGE_TYPES;

    const displayFormats = sectionConfig.allowedFormats?.length
        ? sectionConfig.allowedFormats
        : ACCEPTED_IMAGE_TYPES.map((type) => {
              if (type === "image/jpeg") return "jpg";
              return type.replace("image/", "");
          });

    return z
        .instanceof(File)
        .refine((file) => file.size > 0, "File cannot be empty.")
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        )
        .refine(
            (file) => allowedTypes.includes(file.type),
            `Allowed formats: ${displayFormats.join(", ")}`
        );
};

export const validateImageUpload = (
    files: File[],
    currentImagesCount: number,
    sectionConfig: SectionConfig
) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    if (
        !sectionConfig.allowReplace &&
        sectionConfig.maxImages > 0 &&
        currentImagesCount + files.length > sectionConfig.maxImages
    ) {
        errors.push(
            `Cannot upload ${files.length} image(s). Limit is ${
                sectionConfig.maxImages
            }. Remaining slots: ${
                sectionConfig.maxImages - currentImagesCount
            }.`
        );

        return { errors, validFiles };
    }

    const fileSchema = createFileSchema(sectionConfig);

    files.forEach((file) => {
        const validationResult = fileSchema.safeParse(file);

        if (validationResult.success) {
            validFiles.push(file);
        } else {
            errors.push(
                `${file.name}: ${
                    validationResult.error.issues[0]?.message || "Invalid file"
                }`
            );
        }
    });

    return { errors, validFiles };
};