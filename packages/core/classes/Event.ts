export default class Event {
  name: string;
  value?: unknown;
  constructor({ name, value }: { name: string; value?: unknown }) {
    this.name = name;
    this.value = value;
  }
}
