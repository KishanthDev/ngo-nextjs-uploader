import MediaManager from "@/components/media-manager/MediaManager";
import { Toaster } from "react-hot-toast";

export default function AdminMediaPage() {
    return (
        <>
            <Toaster position="bottom-right" />
            <MediaManager />
        </>
    );
}