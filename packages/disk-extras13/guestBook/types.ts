import type { ItemData } from '@web-workbench/core/classes/FileSystem/types';

export interface Options {
  fileItemPath: string;
}

export interface Model {
  isLocked: boolean;
  options: Options;
  actions?: {
    close: () => void;
    openInfo: () => void;
    setOptions: (options: Partial<Options>) => void;
    setupStorage: () => Promise<void>;
    updateStorage: () => Promise<void>;
    import: (file: File) => Promise<void>;
    export: () => Promise<void>;
    writeEntry: () => Promise<void>;
    editEntry: (
      entryContent: EntryContent,
      originEntry: Entry
    ) => Promise<void>;
    setSelectedEntries: (entries: string[]) => void;
    publishEntries: (entries: string[], value: boolean) => void;
    addEntry: (entry: EntryContent) => Promise<void>;
    editEntries: (entries: string[]) => Promise<void>;
    removeEntries: (entries: string[]) => void;
    truncate: () => Promise<void>;
  };
  entries: Entry[];
  selectedEntries?: string[];
}

export interface EntryContent {
  author: string;
  subject: string;
  message: string;
}

export interface Entry extends EntryContent {
  id: string;
  date: number;
  published: boolean;
}

export type Content = Entry[];

export type GuestBookItemData = ItemData<Entry[]>;
