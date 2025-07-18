import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { MdDragIndicator } from "react-icons/md";
import { FaEye, FaPlus } from "react-icons/fa6";
import type { SectionBlockProps } from "../actions/types";

const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  index,
  moveSection,
  displayedSections,
  children,
  onViewSection,
  onAddItem,
  copysection,
  deletesection,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Drag and drop
  const [, drag] = useDrag({
    type: "SECTION",
    item: { id: section.section_id, index },
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover(item: { id: number; index: number }) {
      if (!ref.current) return;
      const dragIndex = displayedSections.findIndex(
        (s) => s.section_id === item.id
      );
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Handle localStorage flag
  useEffect(() => {
    const updateExpanded = () => {
      const flag = localStorage.getItem("Flag");
      if (flag === "1") {
        setExpandedKeys([section.section_id.toString()]);
      } else {
        setExpandedKeys([]);
      }
    };
    updateExpanded();
    window.addEventListener("storage", updateExpanded);
    return () => window.removeEventListener("storage", updateExpanded);
  }, [section.section_id]);

  const handleCollapseChange = (keys: string[] | string) => {
    setExpandedKeys(Array.isArray(keys) ? keys : [keys]);
  };

  return (
    <div ref={ref} className="mb-6 border rounded shadow bg-white">
      <Collapse
        activeKey={expandedKeys}
        onChange={handleCollapseChange}
        expandIconPosition="start"
        expandIcon={() => null} // Hide the default icon
        items={[
          {
            key: section.section_id.toString(),
            label: (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <MdDragIndicator className="cursor-grab rotate-90" />

                  {/* Custom Expand Icon */}
                  <div
                    className="flex items-center justify-center w-5 h-5"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent collapse triggering twice
                      const key = section.section_id.toString();
                      if (expandedKeys.includes(key)) {
                        setExpandedKeys([]);
                      } else {
                        setExpandedKeys([key]);
                      }
                    }}
                  >
                    <CaretRightOutlined
                      rotate={
                        expandedKeys.includes(section.section_id.toString())
                          ? 90
                          : 0
                      }
                      style={{ fontSize: "14px" }}
                    />
                  </div>

                  <span className="font-semibold text-lg">
                    {section.section_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSection(section);
                    }}
                  >
                    <FaEye className="text-lg" />
                  </button>

                  <div className="relative">
                    <button
                      className="p-2 rounded hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen((prev) => !prev);
                      }}
                    >
                      <FaPlus className="text-lg" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddItem(section.section_id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Add New Item
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copysection(section.section_id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Copy Section
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to delete this section?"
                              )
                            ) {
                              deletesection(section.section_id);
                              setDropdownOpen(false);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Delete Section
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
            children: <div>{children}</div>,
          },
        ]}
      />
    </div>
  );
};

export default React.memo(SectionBlock);
