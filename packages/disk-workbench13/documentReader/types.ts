import type Item from '@web-workbench/core/classes/FileSystem/Item';
import type { DocumentModel } from '../documentEditor/types';
import type { ItemModel } from '@web-workbench/core/classes/MenuItem/Interaction';

export interface Model {
  actions?: {
    close: () => void;
    focus: () => void;
    openInfo: () => void;
  };
  fsItem?: Item;
  value: DocumentModel & ItemModel;
  fontFamily: string;
}
