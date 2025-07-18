export interface Item {
  id: any;
  item_id: number;
  subject: string;
  quantity: number;
  unit: string;
  unit_cost: string;
  total: string;
  item_type_name: string;
  section_name: string;
  section_id: number;
}

export interface Section {
  section_id: number;
  section_name: string;
  description?: string;
  isOptional?: boolean;
  items: Item[];
}

export interface GridState {
  displayedSections: any;
  data: Item[];
  groupedItems: Section[];
  loading: boolean;
  error: string | null;
  sectionRows: { [key: string]: any };
}

export interface FetchSuccessPayload {
  items: Item[];
  groupedItems: Section[];
}
import * as types from "./actionTypes";

export type GridAction =
  | { type: typeof types.FETCH_GRID_DATA_REQUEST }
  | { type: typeof types.FETCH_GRID_DATA_SUCCESS; payload: FetchSuccessPayload }
  | { type: typeof types.FETCH_GRID_DATA_FAILURE; payload: string }
  | {
      type: typeof types.ADD_SECTION_REQUEST;
      payload: { name: string; description: string; isOptional: boolean };
    }
  | { type: typeof types.ADD_SECTION_SUCCESS; payload: Section }
  | {
      type: typeof types.UPDATE_SECTION_REQUEST;
      payload: { sectionId: number; updates: Partial<Section> };
    }
  | {
      type: typeof types.UPDATE_SECTION_SUCCESS;
      payload: { sectionId: number; updates: Partial<Section> };
    }
  | { type: typeof types.DELETE_SECTION_REQUEST; payload: number }
  | { type: typeof types.DELETE_SECTION_SUCCESS; payload: number }
  | { type: typeof types.COPY_SECTION_REQUEST; payload: number }
  | {
      type: typeof types.COPY_SECTION_SUCCESS;
      payload: { newSection: Section; insertAfterId: number };
    }
  | {
      type: typeof types.ADD_ITEM_REQUEST;
      payload: { sectionId: number; item: Partial<Item> };
    }
  | {
      type: typeof types.ADD_ITEM_SUCCESS;
      payload: { sectionId: number; newItem: Item };
    }
  | {
      type: typeof types.DELETE_ITEM_REQUEST;
      payload: { sectionId: number; itemId: number };
    }
  | {
      type: typeof types.DELETE_ITEM_SUCCESS;
      payload: { sectionId: number; itemId: number };
    }
  | {
      type: typeof types.MOVE_SECTION_REQUEST;
      payload: { fromIndex: number; toIndex: number };
    }
  | {
      type: typeof types.MOVE_SECTION_SUCCESS;
      payload: any[];
    }
  | {
      type: typeof types.UPDATE_SECTION_ROWS_SUCCESS;
      payload: { [key: string]: any };
    }
  | { type: typeof types.UPDATE_GROUPED_ITEMS_DND; payload: any }
  | {
      type: typeof types.UPDATE_ITEM_IN_SECTION;
      payload: { sectionName: string; updatedItem: Item };
    };
