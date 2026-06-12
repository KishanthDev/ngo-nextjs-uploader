import { NextRequest, NextResponse } from "next/server";
import { handleImageReplace } from "@/lib/media.service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const oldPublicId = formData.get("oldPublicId") as string;
        const newFile = formData.get("newFile") as File;

        if (!oldPublicId || !newFile) {
            return NextResponse.json(
                { success: false, message: "Missing oldPublicId or newFile." },
                { status: 400 }
            );
        }

        const result = await handleImageReplace(oldPublicId, newFile);

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error: any) {
        console.error("API Replace Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}