import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

interface Props {
  onAddSection: () => void;
}

const AddItemDropdown: React.FC<Props> = ({ onAddSection }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 bg-black text-white rounded flex items-center"
      >
        Add Item{" "}
        <IoMdArrowDropdown className={open ? "transform rotate-180" : ""} />
      </button>
      {open && (
        <div className="absolute right-0 bg-white border shadow mt-1">
          <button
            onClick={() => {
              onAddSection();
              setOpen(false);
            }}
            className="block px-4 py-2 min-w-max hover:bg-gray-100"
          >
            Add New Section
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AddItemDropdown);
