// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Event<TValue = any, TScope = unknown> {
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
