import { NextRequest, NextResponse } from "next/server";
import { handleImageUpload } from "@/lib/media.service";
import { ImageAsset } from "@/types/media";

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

    const currentImages: ImageAsset[] = []; // fetch current images if your validation requires it

    const result = await handleImageUpload(
      companyId,
      sectionId,
      files,
      currentImages
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
}