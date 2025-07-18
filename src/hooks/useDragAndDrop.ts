import type { GridApi } from "ag-grid-community";
import { useDispatch } from "react-redux";
import * as actions from "../redux/actions";

export function useDragAndDrop(
  gridApiRefs: React.MutableRefObject<{ [key: number]: GridApi | null }>
) {
  const dispatch = useDispatch();

  const rebindDropZones = () => {
    const apis = gridApiRefs.current;
    Object.entries(apis).forEach(([fromId, fromApi]) => {
      Object.entries(apis).forEach(([toId, toApi]) => {
        const fromSectionId = Number(fromId);
        const toSectionId = Number(toId);
        if (
          fromApi &&
          toApi &&
          fromSectionId !== toSectionId &&
          !fromApi.isDestroyed?.() &&
          !toApi.isDestroyed?.()
        ) {
          addDropZone(fromApi, toApi, fromSectionId, toSectionId);
        }
      });
    });
  };
  const addDropZone = (
    fromApi: GridApi,
    toApi: GridApi,
    fromSectionId: number,
    toSectionId: number
  ) => {
    const dropZoneParams = toApi.getRowDropZoneParams({
      onDragStop: (params) => {
        const movedData = params.nodes.map((node) => node.data);
        const overIndex = params.overIndex ?? -1;
        dispatch(
          actions.moveRowBetweenSections({
            fromSectionId,
            toSectionId,
            movedData,
            overIndex,
          })
        );
      },
    });

    if (dropZoneParams) {
      fromApi.addRowDropZone(dropZoneParams);
    }
  };

  return { rebindDropZones };
}
