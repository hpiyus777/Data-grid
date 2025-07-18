import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import type { MarkupToggleProps } from "../actions/types";

const MarkupToggle: React.FC<MarkupToggleProps> = ({
  showMarkup,
  setShowMarkup,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
          ${showMarkup ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
        onClick={() => setShowMarkup(true)}
      >
        <FaEye className="text-lg" />
        Show Markup
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
          ${!showMarkup ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
        onClick={() => setShowMarkup(false)}
      >
        <FaEyeSlash className="text-lg" />
        Hide Markup
      </button>
    </div>
  );
};

export default MarkupToggle;
