// Item Disk Definition

import type Core from '../Core';
import type { ItemRawDefinition } from './types';

export function defineFileItems(
  item: ({
    core
  }: {
    core: Core;
  }) => ItemRawDefinition[] | Promise<ItemRawDefinition[]>
) {
  return (options: { core: Core }) => item(options);
}

export function defineFloppyDisk(
  item: ({
    core
  }: {
    core: Core;
  }) => ItemRawDefinition | Promise<ItemRawDefinition>
) {
  return (options: { core: Core }) => item(options);
}
