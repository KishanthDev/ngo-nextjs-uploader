import React, { useState, useRef, useCallback } from "react";
import { ImageAsset, SectionConfig } from "@/types/media";
import { toast } from "react-hot-toast";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    companyId: string;
    sectionId: string;
    sectionConfig: SectionConfig;
    currentImages: ImageAsset[];
}

const UploadModal: React.FC<UploadModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    companyId,
    sectionId,
    sectionConfig,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const resetModal = useCallback(() => {
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    }, [onClose]);

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select one or more files to upload.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading(`Uploading ${selectedFiles.length} file(s)...`);
        const formData = new FormData();
        formData.append("companyId", companyId);
        formData.append("sectionId", sectionId);
        selectedFiles.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("/api/media/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Upload failed.");
            }

            let successCount = 0;
            data.results.forEach((result: any) => {
                if (result.success) {
                    successCount++;
                } else {
                    toast.error(result.message, { id: `err-${Math.random()}` });
                }
            });

            toast.success(`${successCount} file(s) uploaded successfully!`, { id: toastId });
            onSuccess();
            resetModal();
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred.", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
                <div className="mb-4">
                    <input
                        type="file"
                        multiple={sectionConfig.maxImages !== 1}
                        accept={sectionConfig.allowedFormats?.map((f) => `image/${f}`).join(", ") || "image/*"}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedFiles.length > 0 && <p className="text-sm text-gray-600 mt-2">{selectedFiles.length} file(s) selected.</p>}
                </div>
                <div className="flex justify-end space-x-3">
                    <button onClick={resetModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isUploading}>Cancel</button>
                    <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isUploading || selectedFiles.length === 0}>
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;