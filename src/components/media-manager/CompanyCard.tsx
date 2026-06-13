import React from "react";
import { Company } from "@/types/media";

interface CompanyCardProps {
    company: Company;
    isSelected: boolean;
    onSelect: (companyId: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
    company,
    isSelected,
    onSelect,
}) => {
    return (
        <button
            onClick={() => onSelect(company.id)}
            className={`
                relative w-full rounded-xl px-4 py-3 text-left
                transition-all duration-200
                ${
                    isSelected
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 border hover:bg-gray-300 border-transparent"
                }
            `}
        >
            {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
            )}

            <span className="font-medium">{company.name}</span>
        </button>
    );
};

export default CompanyCard;