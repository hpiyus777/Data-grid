import { useRef, useEffect } from "react";
import type { GridApi } from "ag-grid-community";

export const useGridApi = (groupedItems: any[]) => {
  const gridApiRefs = useRef<{ [sectionId: number]: GridApi | null }>({});

  useEffect(() => {
    groupedItems.forEach((section) => {
      const api = gridApiRefs.current[section.section_id];
      if (api) {
        const currentRowData = api.getDisplayedRowAtIndex(0)?.data;
        const newData = section.items;

        if (
          !currentRowData ||
          currentRowData.item_id !== newData[0]?.item_id ||
          newData.length !== api.getDisplayedRowCount()
        ) {
          api.applyTransaction({ update: newData });
        }
      }
    });
  }, [groupedItems]);

  return { gridApiRefs };
};
