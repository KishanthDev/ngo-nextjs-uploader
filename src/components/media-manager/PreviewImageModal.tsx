import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ImageAsset } from "@/types/media";

interface PreviewImageModalProps {
    isOpen: boolean;
    image: ImageAsset | null;
    onClose: () => void;
}

const PreviewImageModal: React.FC<PreviewImageModalProps> = ({
    isOpen,
    image,
    onClose,
}) => {
    if (!isOpen || !image) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-7xl h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Image */}
                <Image
                    src={image.secure_url}
                    alt={image.original_filename || image.public_id}
                    fill
                    priority
                    className="object-contain"
                    sizes="100vw"
                />

                {/* Filename */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex max-w-full px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                        <p className="text-white text-sm truncate">
                            {image.original_filename ||
                                image.public_id.split("/").pop()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewImageModal;