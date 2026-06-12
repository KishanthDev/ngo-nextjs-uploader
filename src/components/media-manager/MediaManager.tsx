"use client";

import React, { createContext, useContext } from "react";
import CompanyCard from "./CompanyCard";
import SectionCard from "./SectionCard";
import ImageGrid from "./ImageGrid";
import { useMediaManager } from "@/hooks/useMediaManager";
import { MediaManagerContextType } from "@/types/media";
import { getSectionConfig } from "@/lib/media.config";

const MediaManagerContext = createContext<MediaManagerContextType | undefined>(
    undefined
);

export const useMediaManagerContext = () => {
    const context = useContext(MediaManagerContext);
    if (context === undefined) {
        throw new Error(
            "useMediaManagerContext must be used within a MediaManagerProvider"
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
            <div className="flex h-screen bg-gray-100 font-sans">
                <aside className="w-72 bg-gray-800 text-white p-4 flex flex-col shrink-0">
                    <h1 className="text-2xl font-bold mb-8 px-2">Media Manager</h1>
                    <nav className="flex-grow flex flex-col space-y-6">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3 px-2">
                                Companies
                            </h2>
                            <div className="space-y-1">
                                {companies.map((company) => (
                                    <CompanyCard key={company.id} company={company} isSelected={selectedCompanyId === company.id} onSelect={setSelectedCompanyId} />
                                ))}
                            </div>
                        </div>

                        {selectedCompanyId && sections.length > 0 && (
                            <div className="flex-grow">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3 px-2">
                                    Sections
                                </h2>
                                <div className="space-y-1">
                                    {sections.map((section) => (
                                        <SectionCard key={section.id} section={section} isSelected={selectedSectionId === section.id} onSelect={setSelectedSectionId} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto bg-white">
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">{error}</div>}

                    {selectedCompanyId && selectedSectionId && selectedSectionConfig ? (
                        <ImageGrid companyId={selectedCompanyId} sectionId={selectedSectionId} images={images} sectionConfig={selectedSectionConfig} loading={loading} refreshImages={refreshImages} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p>{companies.length === 0 ? "No companies configured." : "Select a company and section to begin."}</p>
                        </div>
                    )}
                </main>
            </div>
        </MediaManagerContext.Provider>
    );
};

export default MediaManager;