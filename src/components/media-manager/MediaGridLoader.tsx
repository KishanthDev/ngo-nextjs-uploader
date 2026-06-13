import React from "react";

interface MediaGridLoaderProps {
    count?: number;
}

const MediaGridLoader: React.FC<MediaGridLoaderProps> = ({
    count = 12,
}) => {
    return (
        <div className="animate-pulse">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="h-8 w-32 rounded-lg bg-gray-200" />
                    <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
                </div>

                <div className="h-10 w-36 rounded-xl bg-gray-200" />
            </div>

            {/* Grid */}
            <div
                className="
                    grid
                    grid-cols-2
                    gap-3

                    sm:grid-cols-3
                    sm:gap-4

                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                "
            >
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="
                            aspect-square
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            shadow-sm
                        "
                    >
                        <div className="h-full w-full bg-gray-200" />

                        <div className="absolute hidden" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaGridLoader;