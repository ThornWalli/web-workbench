export default class Bucket<TItem> {
  items: TItem[] = [];
  itemsMapping: Map<string, TItem> = new Map();
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  add(items: TItem[]) {
    items.forEach(item => {
      (item as { [key: string]: string[] })[this.key].forEach(name => {
        this.itemsMapping.set(name, item);
      });
    });
    this.items.push(...items);
  }

  remove(items: TItem[]) {
    items.forEach(item => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }

  has(name: string) {
    return this.itemsMapping.has(name);
  }

  get(name: string) {
    return this.itemsMapping.get(name);
  }

  clear() {
    this.items = [];
    this.itemsMapping.clear();
  }
}
