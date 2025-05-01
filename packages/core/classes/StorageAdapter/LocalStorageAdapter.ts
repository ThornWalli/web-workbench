import { StorageAdapter } from '.';

export default class LocalStorageAdapter extends StorageAdapter {
  override isLogged(): boolean {
    return true;
  }

  override getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  override setItem(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  override removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  override clear(): void {
    localStorage.clear();
  }
}
