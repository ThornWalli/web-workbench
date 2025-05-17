import type Core from '../classes/Core';
import BaseItem from '../classes/MenuItem/Base';
import type { BaseItemOption } from '../classes/MenuItem/Base';

export function defineMenuItems<T = object>(
  items: (options: { core: Core } & T) => BaseItemOption[]
) {
  return (options: { core: Core } & T) => items(options);
}
export function generateMenuItems(items: (BaseItem | BaseItemOption)[]) {
  return items.map(item =>
    item instanceof BaseItem ? item : new BaseItem(item)
  );
}
