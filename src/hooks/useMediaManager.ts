"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Company,
    Section,
    ImageAsset,
    MediaManagerContextType,
} from "@/types/media";
import {
  getCompanies,
  getSectionsForCompany,
} from "@/lib/media.config";
import { toast } from "react-hot-toast";

export const useMediaManager = (): MediaManagerContextType => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
        null
    );
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
        null
    );
    const [images, setImages] = useState<ImageAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initialCompanies = getCompanies();
        setCompanies(initialCompanies);
        if (initialCompanies.length > 0) {
            setSelectedCompanyId(initialCompanies[0].id);
        }
    }, []);

    const sections = useMemo(() => {
        if (!selectedCompanyId) return [];
        return getSectionsForCompany(selectedCompanyId);
    }, [selectedCompanyId]);

    useEffect(() => {
        if (sections.length > 0) {
            setSelectedSectionId(sections[0].id);
        } else {
            setSelectedSectionId(null);
        }
    }, [sections]);

    const fetchImages = useCallback(async () => {
        if (!selectedCompanyId || !selectedSectionId) {
            setImages([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `/api/media/list?companyId=${selectedCompanyId}&sectionId=${selectedSectionId}`
            );
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch images.");
            }
            setImages(data.images);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [selectedCompanyId, selectedSectionId]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return {
        companies,
        selectedCompanyId,
        setSelectedCompanyId,
        sections,
        selectedSectionId,
        setSelectedSectionId,
        images,
        loading,
        error,
        refreshImages: fetchImages,
    };
};