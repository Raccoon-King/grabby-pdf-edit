
export type ItemType = 'text' | 'redaction';

export interface EditableItem {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  type: ItemType;
  text?: string;
}

export interface PageInfo {
  id: string;
  originalIndex: number;
}

export interface PageDimensions {
  [pageNumber: number]: {
    width: number;
    height: number;
  };
}
