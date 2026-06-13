import React, { useState } from "react";
import { ImageAsset } from "@/types/media";
import { toast } from "react-hot-toast";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    imagesToDelete: ImageAsset[];
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    imagesToDelete,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        const toastId = toast.loading(`Deleting ${imagesToDelete.length} image(s)...`);

        try {
            const publicIds = imagesToDelete.map((img) => img.public_id);
            const response = await fetch("/api/media/delete", {
                method: "POST", // Using POST to have a body, but semantically it's a DELETE
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicIds }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Deletion failed.");
            }

            toast.success("Image(s) deleted successfully!", { id: toastId });
            onConfirm();
            onClose();
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Confirm Deletion</h2>
                <p className="mb-6 text-gray-600">Are you sure you want to delete {imagesToDelete.length} image(s)? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isDeleting}>Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;