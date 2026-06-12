import React, { useState } from "react";
import { ImageAsset, SectionConfig } from "@/types/media";
import MediaPreview from "./MediaPreview";
import UploadModal from "./UploadModal";
import ReplaceModal from "./ReplaceModal";
import DeleteDialog from "./DeleteDialog";

interface ImageGridProps {
    companyId: string;
    sectionId: string;
    images: ImageAsset[];
    sectionConfig: SectionConfig;
    loading: boolean;
    refreshImages: () => Promise<void>;
}

const ImageGrid: React.FC<ImageGridProps> = ({
    companyId,
    sectionId,
    images,
    sectionConfig,
    loading,
    refreshImages,
}) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
    const [imageToReplace, setImageToReplace] = useState<ImageAsset | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ImageAsset | null>(null);

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        refreshImages();
    };

    const handleReplaceClick = (image: ImageAsset) => {
        setImageToReplace(image);
        setIsReplaceModalOpen(true);
    };

    const handleReplaceSuccess = () => {
        setIsReplaceModalOpen(false);
        setImageToReplace(null);
        refreshImages();
    };

    const handleDeleteClick = (image: ImageAsset) => {
        setImageToDelete(image);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        setIsDeleteDialogOpen(false);
        setImageToDelete(null);
        refreshImages();
    };

    const canUploadMore =
        sectionConfig.maxImages === 0 || images.length < sectionConfig.maxImages;
    const isSingleImageSection = sectionConfig.maxImages === 1;

    if (loading) {
        return <div className="text-center py-10">Loading Images...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                    Images{" "}
                    <span className="text-gray-500 font-normal">
                        ({images.length}
                        {sectionConfig.maxImages > 0 ? ` / ${sectionConfig.maxImages}` : ""})
                    </span>
                </h3>
                {isSingleImageSection && images.length > 0 && sectionConfig.allowReplace && (
                    <button
                        onClick={() => handleReplaceClick(images[0])}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                        Replace Image
                    </button>
                )}
                {(!isSingleImageSection || images.length === 0) && canUploadMore && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Upload Images
                    </button>
                )}
            </div>

            {images.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No images in this section yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {images.map((image) => (
                        <MediaPreview
                            key={image.public_id}
                            image={image}
                            onReplace={sectionConfig.allowReplace ? handleReplaceClick : undefined}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onSuccess={handleUploadSuccess} companyId={companyId} sectionId={sectionId} sectionConfig={sectionConfig} currentImages={images} />
            {imageToReplace && <ReplaceModal isOpen={isReplaceModalOpen} onClose={() => setIsReplaceModalOpen(false)} onSuccess={handleReplaceSuccess} oldImage={imageToReplace} />}
            {imageToDelete && <DeleteDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} imagesToDelete={[imageToDelete]} />}
        </div>
    );
};

export default ImageGrid;