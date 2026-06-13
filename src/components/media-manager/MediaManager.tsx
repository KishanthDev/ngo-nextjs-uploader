"use client";

import React, { createContext, useContext } from "react";
import CompanyCard from "./CompanyCard";
import SectionCard from "./SectionCard";
import ImageGrid from "./ImageGrid";

import { useMediaManager } from "@/hooks/useMediaManager";
import { MediaManagerContextType } from "@/types/media";
import { getSectionConfig } from "@/lib/media.config";

const MediaManagerContext = createContext<
    MediaManagerContextType | undefined
>(undefined);

export const useMediaManagerContext = () => {
    const context = useContext(MediaManagerContext);

    if (!context) {
        throw new Error(
            "useMediaManagerContext must be used within MediaManagerProvider"
        );
    }

    return context;
};

const MediaManager: React.FC = () => {
    const mediaManagerHook = useMediaManager();

    const {
        companies,
        selectedCompanyId,
        setSelectedCompanyId,
        sections,
        selectedSectionId,
        setSelectedSectionId,
        images,
        loading,
        error,
        refreshImages,
    } = mediaManagerHook;

    const selectedSectionConfig =
        selectedCompanyId && selectedSectionId
            ? getSectionConfig(selectedCompanyId, selectedSectionId)
            : undefined;

    return (
        <MediaManagerContext.Provider value={mediaManagerHook}>
            <div className="flex h-screen flex-col lg:flex-row bg-gray-50">
                {/* Sidebar */}
                <aside
                    className="
                        w-full
                        lg:w-80
                        lg:shrink-0
                        bg-white
                        border-b
                        lg:border-b-0
                        lg:border-r
                        border-gray-200
                    "
                >
                    <div className="p-5 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900">
                            Media Manager
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage media assets
                        </p>
                    </div>

                    <div className="p-4 space-y-6 overflow-y-auto lg:h-[calc(100vh-88px)]">
                        {/* Companies */}
                        <div>
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Companies
                            </h2>

                            {/* Mobile Horizontal */}
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
                                {companies.map((company) => (
                                    <button
                                        key={company.id}
                                        onClick={() =>
                                            setSelectedCompanyId(company.id)
                                        }
                                        className={`
                                            whitespace-nowrap rounded-full px-4 py-2 text-sm
                                            ${
                                                selectedCompanyId === company.id
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700"
                                            }
                                        `}
                                    >
                                        {company.name}
                                    </button>
                                ))}
                            </div>

                            {/* Desktop */}
                            <div className="hidden lg:block space-y-2">
                                {companies.map((company) => (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                        isSelected={
                                            selectedCompanyId === company.id
                                        }
                                        onSelect={setSelectedCompanyId}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sections */}
                        {selectedCompanyId && sections.length > 0 && (
                            <div>
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Sections
                                </h2>

                                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                                    {sections.map((section) => (
                                        <SectionCard
                                            key={section.id}
                                            section={section}
                                            isSelected={
                                                selectedSectionId === section.id
                                            }
                                            onSelect={setSelectedSectionId}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {selectedCompanyId &&
                    selectedSectionId &&
                    selectedSectionConfig ? (
                        <>
                            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">
                                        Manage uploaded media assets
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                                    {error}
                                </div>
                            )}

                            <ImageGrid
                                companyId={selectedCompanyId}
                                sectionId={selectedSectionId}
                                images={images}
                                sectionConfig={selectedSectionConfig}
                                loading={loading}
                                refreshImages={refreshImages}
                            />
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center px-6">
                            <div className="text-center">
                                <div className="mb-4 text-6xl">🖼️</div>

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Select a section
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    Choose a company and section to manage media.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </MediaManagerContext.Provider>
    );
};

export default MediaManager;