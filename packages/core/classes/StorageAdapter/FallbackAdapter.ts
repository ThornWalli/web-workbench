import { StorageAdapter } from '.';

export default class FallbackAdapter extends StorageAdapter {
  #data = new Map<string, string | null>();
  override isLogged(): boolean {
    return true;
  }
  override getItem(key: string): string | null {
    return this.#data.get(key) || null;
  }
  override setItem(key: string, value: string | null): void {
    this.#data.set(key, value);
  }
  override removeItem(key: string): void {
    this.#data.delete(key);
  }
  override clear(): void {
    this.#data.clear();
  }
}
