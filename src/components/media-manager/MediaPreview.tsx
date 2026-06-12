import React from "react";
import Image from "next/image";
import { ImageAsset } from "@/types/media";

interface MediaPreviewProps {
    image: ImageAsset;
    onReplace?: (image: ImageAsset) => void;
    onDelete?: (image: ImageAsset) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
    image,
    onReplace,
    onDelete,
}) => {
    return (
        <div className="relative group bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 aspect-square">
            <Image
                src={image.secure_url}
                alt={image.original_filename || image.public_id}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-semibold truncate">
                    {image.original_filename || image.public_id.split("/").pop()}
                </p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                {onReplace && (
                    <button
                        onClick={() => onReplace(image)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-yellow-600"
                    >
                        Replace
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(image)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaPreview;