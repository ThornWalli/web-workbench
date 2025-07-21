import { generateMenuItems } from '@web-workbench/core/utils/menuItems';
import type { ComputedRef } from 'vue';

export interface Options {
  disabled?: boolean | ComputedRef<boolean | undefined> | undefined;
}

export interface BaseItemOption<TOptions extends Options = Options> {
  id?: string;
  key?: string;
  order?: number;
  options?: TOptions;
  items?: BaseItemOption[];
  onInit?: <T = BaseItem<TOptions>>(item: T) => void;
}

export default class BaseItem<TOptions extends Options = Options>
  implements BaseItemOption<TOptions>
{
  id: string;
  key?: string;
  order?: number;
  options: TOptions;

  items: BaseItem[];

  constructor({
    id,
    key,
    options,
    order = -1,
    items = [],
    onInit
  }: BaseItemOption<TOptions> = {}) {
    this.id = id ?? crypto.randomUUID();
    this.key = key;
    this.order = order;
    this.options =
      options ||
      ({
        disabled: false
      } as TOptions);

    //  reactive({
    //   disabled: false,
    //   ...(unoptions) || {})
    // });
    this.items = generateMenuItems(items);

    if (onInit) {
      onInit<BaseItem<TOptions>>(this);
    }
  }
}
