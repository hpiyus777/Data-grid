import { useEffect } from "react";

export const useSyncGridRows = (groupedItems: any[], gridRefs: any) => {
  useEffect(() => {
    groupedItems.forEach((section) => {
      const api = gridRefs.current[section.section_id];
      if (api) {
        api.applyTransaction({ update: section.items });
      }
    });
  }, [groupedItems]);
};
