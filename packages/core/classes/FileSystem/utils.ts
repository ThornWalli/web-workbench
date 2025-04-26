// Item Disk Definition

import type Core from '../Core';
import type { ItemRawDefinition } from './types';

export function defineFileItems(
  item: ({ core }: { core: Core }) => ItemRawDefinition
) {
  return (options: { core: Core }) => item(options);
}
