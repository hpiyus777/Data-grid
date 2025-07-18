import { useState, useEffect } from "react";

export const useSectionManagement = (groupedItems: any[]) => {
  const [sectionRows, setSectionRows] = useState<{
    [sectionId: number]: any[];
  }>({});
  const [displayedSections, setDisplayedSections] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    setExpandedKeys(groupedItems.map((s) => s.section_id.toString()));
  }, [groupedItems]);

  useEffect(() => {
    if (!groupedItems.length) return;
    const initialSectionRows: { [sectionId: number]: any[] } = {};
    groupedItems.forEach((section) => {
      initialSectionRows[section.section_id] = section.items;
    });
    setSectionRows(initialSectionRows);
    setDisplayedSections(groupedItems.slice(0, 1));
  }, [groupedItems]);

  return {
    sectionRows,
    setSectionRows,
    displayedSections,
    setDisplayedSections,
    expandedKeys,
    setExpandedKeys,
  };
};
