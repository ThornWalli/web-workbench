import type CloudDisk from '@web-workbench/core/classes/FileSystem/items/CloudDisk';

export interface Actions {
  login: (email: string, password: string, storageId: string) => Promise<void>;
  logout: (id: string) => Promise<void>;
  connect: (id: string, apiKey: string, url: string) => Promise<void>;
  disconnect: (id: string) => Promise<void>;
  openInfo: () => void;
  openLogin: () => void;
  openConnect: () => void;
}

export interface Model {
  id: string | null;
  items: CloudDisk[];
  actions?: Actions;
}

export interface ModelLogin {
  email?: string;
  password?: string;
  storage?: string;
  remainLoggedIn?: boolean;
  actions?: Actions;
}
export interface ModelConnect {
  id?: string;
  url?: string;
  apiKey?: string;
  actions?: Actions;
}
