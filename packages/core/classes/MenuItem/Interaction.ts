import type { ComputedRef } from 'vue';
import type { BaseItemOption, Options } from './Base';
import BaseItem from './Base';
import type { KEYBOARD_CODE } from '../../services/dom';

export enum INTERACTION_TYPE {
  CHECKBOX = 0,
  RADIO = 1,
  UPLOAD = 2
}

interface InteractionOptions extends Options {
  checked?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemModel = any;

export interface HotKey {
  code: string | KEYBOARD_CODE;
  title: string;
  shift?: boolean;
  alt?: boolean;
  cmd?: boolean;
  caps?: boolean;
}

export interface InteractionMenuItemOption<TName = string, TModel = ItemModel>
  extends BaseItemOption {
  type?: INTERACTION_TYPE;
  title: string | ComputedRef<string>;
  model?: TModel;
  name?: TName;
  value?: unknown;
  action?: string | CallableFunction;
  command?: string;
  url?: string;
  hotKey?: HotKey;
}

export default class Interaction<
  TName extends string = string,
  TModel extends Record<TName, unknown> = ItemModel
> extends BaseItem<InteractionOptions> {
  type?: INTERACTION_TYPE;
  title: string | ComputedRef<string>;
  model?: TModel;
  name?: TName;
  value?: unknown;
  action?: string | CallableFunction;
  command?: string;
  url?: string;
  hotKey?: HotKey;

  constructor({
    action,
    command,
    url,
    type,
    model,
    name,
    value,
    hotKey,
    ...options
  }: InteractionMenuItemOption<TName, TModel>) {
    super({
      ...options
    });
    this.type = type;
    this.title = options.title || '';
    this.model = model || this.model;
    this.name = name;
    this.value = value;

    if (type === INTERACTION_TYPE.RADIO) {
      this.options.checked = this.options.checked ? !!value : false;
    }

    this.action = action;
    this.command = command;
    this.url = url;

    this.name = name;
    this.value = value;

    this.hotKey = hotKey;
  }

  getValue() {
    if (this.model && this.name) {
      return this.model[this.name];
    } else {
      throw new Error('Model or name is not defined');
    }
  }

  setValue(value: TModel[TName]) {
    if (this.model && this.name) {
      this.model[this.name] = value;
    } else {
      throw new Error('Model or name is not defined');
    }
  }
}
