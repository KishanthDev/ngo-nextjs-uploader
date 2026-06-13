import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { ImageAsset } from "@/types/media";

interface MediaPreviewProps {
    image: ImageAsset;
    onView?: (image: ImageAsset) => void;
    onReplace?: (image: ImageAsset) => void;
    onDelete?: (image: ImageAsset) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
    image,
    onView,
    onReplace,
    onDelete,
}) => {
    return (
        <div className="relative group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md aspect-square">
            {/* Image */}
            <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => onView?.(image)}
            >
                <Image
                    src={image.secure_url}
                    alt={image.original_filename || image.public_id}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </div>

            {/* Filename */}
            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <div className="flex items-end justify-between gap-2">
                    {/* Filename */}
                    <p className="text-white text-xs font-medium truncate flex-1">
                        {image.original_filename ||
                            image.public_id.split("/").pop()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">

                        {onReplace && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReplace(image);
                                }}
                                className="p-1.5 rounded-lg bg-amber-500/80 text-white backdrop-blur-md hover:bg-amber-600 transition-colors shadow-md"
                                title="Replace"
                            >
                                <Pencil size={14} />
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(image);
                                }}
                                className="p-1.5 rounded-lg bg-red-500/80 text-white backdrop-blur-md hover:bg-red-600 transition-colors shadow-md"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPreview;