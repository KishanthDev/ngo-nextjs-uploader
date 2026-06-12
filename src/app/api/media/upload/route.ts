import { NextRequest, NextResponse } from "next/server";
import {
    getMediaAssets,
    handleImageUpload,
} from "@/lib/media.service";
import { getSectionConfig } from "@/lib/media.config";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const companyId = formData.get("companyId") as string;
        const sectionId = formData.get("sectionId") as string;

        const files = formData
            .getAll("files")
            .filter((file): file is File => file instanceof File);

        if (!companyId || !sectionId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing companyId or sectionId",
                },
                { status: 400 }
            );
        }

        if (files.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No files uploaded",
                },
                { status: 400 }
            );
        }

        const currentImages = await getMediaAssets(
            companyId,
            sectionId
        );

        const sectionConfig = getSectionConfig(
            companyId,
            sectionId
        );

        if (
            sectionConfig &&
            currentImages.length + files.length >
            sectionConfig.maxImages
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Only ${sectionConfig.maxImages -
                        currentImages.length
                        } upload(s) remaining.`,
                },
                { status: 400 }
            );
        }

        const results = await handleImageUpload(
            companyId,
            sectionId,
            files,
            currentImages
        );

        return NextResponse.json({
            success: results.every((r) => r.success),
            results,
        });
    } catch (error: any) {
        console.error("Upload API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload images.",
                error: error.message,
            },
            { status: 500 }
        );
    }
}