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

export interface ItemOptions {
  locked?: boolean;
  id: string;
  name: string;
  meta?: { [key: string]: string };
  data?: string;
  createdDate?: number;
  editedDate?: number;
}
