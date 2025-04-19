export interface IStorageAdapter<TData = string> {
  isLogged(): boolean;
  getItem(key: string): TData | null;
  setItem(key: string, value: TData): void;
  removeItem(key: string): void;
  clear(): void;
}

export class StorageAdapter<TData = string> implements IStorageAdapter<TData> {
  isLogged(): boolean {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(key: string): TData | null {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem(key: string, value: TData): void {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem(key: string): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
}
