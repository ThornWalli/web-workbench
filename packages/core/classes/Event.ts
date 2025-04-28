export default class Event<TValue = EventValue, TScope = unknown> {
  name: string;
  value?: TValue;
  scope?: TScope;
  constructor({
    name,
    value,
    scope
  }: {
    name: string;
    value?: TValue;
    scope?: TScope;
  }) {
    this.name = name;
    this.value = value;
    this.scope = scope;
  }
}

export type EventValue = boolean | object;
