import * as types from "./actionTypes";
import type { Section, Item } from "./types";

// FETCH
export const fetchGridDataRequest = () => ({
  type: types.FETCH_GRID_DATA_REQUEST,
  payload: undefined, // or remove if not required by your GridAction type
});
export const fetchGridDataSuccess = (payload: {
  items: Item[];
  groupedItems: Section[];
}) => ({
  type: types.FETCH_GRID_DATA_SUCCESS,
  payload,
});
export const fetchGridDataFailure = (error: string) => ({
  type: types.FETCH_GRID_DATA_FAILURE,
  payload: error,
});

// SECTION
export const addSectionRequest = (data: {
  name: string;
  description: string;
  isOptional: boolean;
}) => ({
  type: types.ADD_SECTION_REQUEST,
  payload: data,
});
export const addSectionSuccess = (newSection: Section) => ({
  type: types.ADD_SECTION_SUCCESS,
  payload: newSection,
});
export const updateSectionRequest = (
  sectionId: number,
  updates: Partial<Section>
) => ({
  type: types.UPDATE_SECTION_REQUEST,
  payload: { sectionId, updates },
});
export const updateSectionSuccess = (
  sectionId: number,
  updates: Partial<Section>
) => ({
  type: types.UPDATE_SECTION_SUCCESS,
  payload: { sectionId, updates },
});
export const deleteSectionRequest = (sectionId: number) => ({
  type: types.DELETE_SECTION_REQUEST,
  payload: sectionId,
});
export const deleteSectionSuccess = (sectionId: number) => ({
  type: types.DELETE_SECTION_SUCCESS,
  payload: sectionId,
});
export const copySectionRequest = (sectionId: number) => ({
  type: types.COPY_SECTION_REQUEST,
  payload: sectionId,
});
export const copySectionSuccess = (
  newSection: Section,
  insertAfterId: number
) => ({
  type: types.COPY_SECTION_SUCCESS,
  payload: { newSection, insertAfterId },
});

export const addItemRequest = (sectionId: number, item: Partial<Item>) => ({
  type: types.ADD_ITEM_REQUEST,
  payload: { sectionId, item },
});
export const addItemSuccess = (sectionId: number, newItem: Item) => ({
  type: types.ADD_ITEM_SUCCESS,
  payload: { sectionId, newItem },
});
export const deleteItemRequest = (sectionId: number, itemId: number) => ({
  type: types.DELETE_ITEM_REQUEST,
  payload: { sectionId, itemId },
});
export const deleteItemSuccess = (sectionId: number, itemId: number) => ({
  type: types.DELETE_ITEM_SUCCESS,
  payload: { sectionId, itemId },
});

export const moveSectionRequest = (fromIndex: number, toIndex: number) => ({
  type: types.MOVE_SECTION_REQUEST,
  payload: { fromIndex, toIndex },
});

export const moveSectionSuccess = (updatedSections: any[]) => ({
  type: types.MOVE_SECTION_SUCCESS,
  payload: updatedSections,
});

export const moveRowBetweenSections = (payload: {
  fromSectionId: number;
  toSectionId: number;
  movedData: any[];
  overIndex: number;
}) => ({
  type: types.MOVE_ROW_BETWEEN_SECTIONS,
  payload,
});

export const updateSectionRowsSuccess = (payload: {
  [sectionId: number]: any[];
}) => ({
  type: types.UPDATE_SECTION_ROWS_SUCCESS,
  payload,
});
export const updateGroupedItemsForDnD = (groupedItems: Section[]) => ({
  type: types.UPDATE_GROUPED_ITEMS_DND,
  payload: groupedItems,
});
export const updateItemInSection = (
  sectionName: string,
  updatedItem: Item
) => ({
  type: types.UPDATE_ITEM_IN_SECTION,
  payload: { sectionName, updatedItem },
});
