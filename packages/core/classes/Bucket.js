export default class Bucket {
  items = [];
  itemsMapping = new Map();
  key;

  constructor (key) {
    this.key = key;
  }

  add (items) {
    items.forEach((item) => {
      [].concat(item[this.key]).forEach((name) => {
        this.itemsMapping.set(name, item);
      });
    });
    this.items.push(...items);
  }

  remove (items) {
    items.forEach((item) => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }

  has (name) {
    return this.itemsMapping.has(name);
  }

  get (name) {
    return this.itemsMapping.get(name);
  }
}
