type Item = { [key: string]: string[] };

export default class Bucket {
  items: unknown[] = [];
  itemsMapping: Map<string, Item> = new Map();
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  add(items: Item[]) {
    items.forEach(item => {
      item[this.key].forEach(name => {
        this.itemsMapping.set(name, item);
      });
    });
    this.items.push(...items);
  }

  remove(items: Item[]) {
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
}
