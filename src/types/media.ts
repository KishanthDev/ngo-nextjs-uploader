export interface ImageAsset {
    public_id: string;
    version: number;
    format: string;
    width: number;
    height: number;
    type: string;
    created_at: string;
    bytes: number;
    url: string;
    secure_url: string;
    original_filename: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    asset?: ImageAsset;
    error?: string;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface SectionConfig {
    maxImages: number;
    allowReplace: boolean;
    allowedFormats?: string[];
}

export interface CompanyConfig {
    displayName: string;
    sections: { [key: string]: SectionConfig };
}

export type MediaConfig = {
    [key: string]: CompanyConfig;
};

export interface Company {
    id: string;
    name: string;
}

export interface Section {
    id: string;
    name: string;
    config: SectionConfig;
}

export interface MediaManagerContextType {
    companies: Company[];
    selectedCompanyId: string | null;
    setSelectedCompanyId: (companyId: string | null) => void;
    sections: Section[];
    selectedSectionId: string | null;
    setSelectedSectionId: (sectionId: string | null) => void;
    images: ImageAsset[];
    loading: boolean;
    error: string | null;
    refreshImages: () => Promise<void>;
}