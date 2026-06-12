import { NextRequest, NextResponse } from "next/server";
import { getMediaAssets } from "@/lib/media.service";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");
        const sectionId = searchParams.get("sectionId");

        if (!companyId || !sectionId) {
            return NextResponse.json(
                { success: false, message: "Missing companyId or sectionId." },
                { status: 400 }
            );
        }

        const images = await getMediaAssets(companyId, sectionId);

        return NextResponse.json({ success: true, images }, { status: 200 });
    } catch (error: any) {
        console.error("API List Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}