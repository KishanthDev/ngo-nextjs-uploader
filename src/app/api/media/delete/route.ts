import { NextRequest, NextResponse } from "next/server";
import { handleImageDelete } from "@/lib/media.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const publicIds = body.publicIds as string[];

        if (!publicIds || publicIds.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No images selected for deletion.",
                },
                { status: 400 }
            );
        }

        const results = await handleImageDelete(publicIds);

        const hasErrors = results.some(
            (result) => !result.success
        );

        return NextResponse.json(
            {
                success: !hasErrors,
                results,
            },
            {
                status: hasErrors ? 207 : 200,
            }
        );
    } catch (error: any) {
        console.error("Delete API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete images.",
                error: error.message,
            },
            { status: 500 }
        );
    }
}