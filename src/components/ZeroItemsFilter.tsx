import React from "react";
import type { Dispatch, SetStateAction } from "react";

interface ZeroItemsFilterProps {
  selectedFilter: string;
  setSelectedFilter: Dispatch<SetStateAction<"yes" | "no">>;
}

const ZeroItemsFilter: React.FC<ZeroItemsFilterProps> = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span>Show Only ₹0 Items:</span>
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedFilter === "yes"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedFilter("yes")}
        >
          Yes
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedFilter === "no"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedFilter("no")}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ZeroItemsFilter;
