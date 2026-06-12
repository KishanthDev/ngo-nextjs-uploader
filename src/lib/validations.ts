import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants/media";
import { SectionConfig } from "@/types/media";

export const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .png, and .webp formats are supported."
    );

export const validateImageUpload = (
    files: File[],
    currentImagesCount: number,
    sectionConfig: SectionConfig
): { errors: string[]; validFiles: File[] } => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    if (
        sectionConfig.maxImages > 0 &&
        currentImagesCount + files.length > sectionConfig.maxImages
    ) {
        errors.push(
            `Cannot upload ${files.length} image(s). This section's limit is ${sectionConfig.maxImages
            }, and you have ${sectionConfig.maxImages - currentImagesCount
            } upload(s) remaining.`
        );
        return { errors, validFiles };
    }

    files.forEach((file) => {
        const validationResult = fileSchema.safeParse(file);
        if (validationResult.success) {
            validFiles.push(file);
        }if (!validationResult.success) {
  const firstIssue = validationResult.error.issues[0];

  errors.push(
    `${file.name}: ${firstIssue?.message || "Invalid file"}`
  );
}
    });

    return { errors, validFiles };
};