import Module, { type ConstructorArgs } from '../../Module';
import FileSystem from '../../FileSystem/index';
import commands from './commands';
import contextMenu from './contextMenu';
import operationCommands from './commands/operations';
import cloudCommands from './commands/cloud';
import type Core from '../../Core';
import type { ItemRawDefinition } from '../../FileSystem/Item';

export const fileSystem = new FileSystem('web_workbench_FS');
export default class Files extends Module {
  static NAME = 'Files';
  fileSystem = fileSystem;
  fs = fileSystem;

  disks: {
    [key: string]: () => ({
      core
    }: {
      core: Core;
    }) => Promise<ItemRawDefinition>;
  } = {};

  constructor({ core }: ConstructorArgs) {
    super({
      name: 'Files',
      commands: ({ module, core }: { module: Files; core: Core }) => [
        ...commands({ module, core }),
        ...operationCommands({ module }),
        ...cloudCommands({ module, core })
      ],
      contextMenu,
      core
    });
  }

  async addDisks(diskMap: {
    [key: string]: () => () => Promise<ItemRawDefinition>;
  }) {
    Object.entries(diskMap).forEach(([name, disk]) => {
      this.disks[String(name)] = disk;
    });
  }
}
