export default class Event<TValue> {
  name: string;
  value?: TValue;
  constructor({ name, value }: { name: string; value?: TValue }) {
    this.name = name;
    this.value = value;
  }
}
