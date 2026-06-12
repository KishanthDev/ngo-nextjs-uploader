// Client-side media configuration utilities - provides functions to access media config for companies and sections
import { MEDIA_CONFIG } from "@/config/media.config";
import { Company, Section, SectionConfig } from "@/types/media";

export const getCompanies = (): Company[] => {
  return Object.keys(MEDIA_CONFIG).map((id) => ({
    id,
    name: MEDIA_CONFIG[id].displayName,
  }));
};

export const getSectionsForCompany = (
  companyId: string
): Section[] => {
  const companyConfig = MEDIA_CONFIG[companyId];
  if (!companyConfig) return [];

  return Object.keys(companyConfig.sections).map((id) => ({
    id,
    name: id.replace(/_/g, " "),
    config: companyConfig.sections[id],
  }));
};

export const getSectionConfig = (
  companyId: string,
  sectionId: string
): SectionConfig | undefined => {
  return MEDIA_CONFIG[companyId]?.sections[sectionId];
};