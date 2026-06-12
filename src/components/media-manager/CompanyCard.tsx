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
            className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
        >
            <h3 className="font-semibold">{company.name}</h3>
        </button>
    );
};

export default CompanyCard;