import React from "react";
import { Section } from "@/types/media";

interface SectionCardProps {
    section: Section;
    isSelected: boolean;
    onSelect: (sectionId: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
    section,
    isSelected,
    onSelect,
}) => {
    return (
        <button
            onClick={() => onSelect(section.id)}
            className={`
                w-full rounded-xl px-4 py-3 text-left
                transition-all duration-200
                ${
                    isSelected
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-300"
                }
            `}
        >
            <span className="font-medium">{section.name}</span>
        </button>
    );
};

export default SectionCard;