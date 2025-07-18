import { useState, useRef } from "react";
import debounce from "lodash/debounce";

type SidebarMode = "addSection" | "itemDetails" | "sectionDetails" | "addItem";

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("itemDetails");
  const [currentSectionId, setCurrentSectionId] = useState<number>();
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openSidebar = useRef(
    debounce((mode: SidebarMode, data: any) => {
      setSidebarMode(mode);
      if (mode === "itemDetails") setSelectedItem(data);
      else if (mode === "sectionDetails") setSelectedSection(data);
      setSidebarOpen(true);
    }, 100)
  ).current;

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarMode,
    setSidebarMode,
    currentSectionId,
    setCurrentSectionId,
    selectedSection,
    selectedItem,
    openSidebar,
  };
};
