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
            className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${isSelected
                    ? "bg-gray-600 text-white"
                    : "hover:bg-gray-700 text-gray-400"
                }`}
        >
            <h3 className="font-medium">{section.name}</h3>
        </button>
    );
};

export default SectionCard;