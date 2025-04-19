import { StorageAdapter } from '.';

export default class SessionStorageAdapter extends StorageAdapter {
  override isLogged(): boolean {
    return true;
  }

  override getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  override setItem(key: string, value: unknown): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  override removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  override clear(): void {
    sessionStorage.clear();
  }
}
