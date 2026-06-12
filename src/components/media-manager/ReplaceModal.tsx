import React, { useState, useRef, useCallback } from "react";
import { ImageAsset } from "@/types/media";
import { toast } from "react-hot-toast";

interface ReplaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    oldImage: ImageAsset;
}

const ReplaceModal: React.FC<ReplaceModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    oldImage,
}) => {
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isReplacing, setIsReplacing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetModal = useCallback(() => {
        setNewFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    }, [onClose]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setNewFile(event.target.files[0]);
        }
    };

    const handleReplace = async () => {
        if (!newFile) {
            toast.error("Please select a new file.");
            return;
        }

        setIsReplacing(true);
        const toastId = toast.loading("Replacing image...");
        const formData = new FormData();
        formData.append("oldPublicId", oldImage.public_id);
        formData.append("newFile", newFile);

        try {
            const response = await fetch("/api/media/replace", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Replacement failed.");
            }

            toast.success("Image replaced successfully!", { id: toastId });
            onSuccess();
            resetModal();
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsReplacing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Replace Image</h2>
                <p className="mb-4 text-sm text-gray-600">Replacing: <span className="font-medium text-gray-800">{oldImage.original_filename || oldImage.public_id}</span></p>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" />
                <div className="flex justify-end space-x-3">
                    <button onClick={resetModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isReplacing}>Cancel</button>
                    <button onClick={handleReplace} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300" disabled={isReplacing || !newFile}>
                        {isReplacing ? "Replacing..." : "Replace"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplaceModal;