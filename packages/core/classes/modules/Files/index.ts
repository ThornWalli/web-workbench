import Module, { type ModuleConstructorOptions } from '../../Module';
import FileSystem from '../../FileSystem';
import commands from './commands';
import contextMenu from './contextMenu';
import operationCommands from './commands/operations';
import cloudCommands from './commands/cloud';
import type Core from '../../Core';
import '../../../classes/FileSystem/Item';
import '../../../classes/FileSystem/ItemContainer';
import '../../FileSystem/items';
import './types';
import { markRaw } from 'vue';
import type { DiskList, DiskMap } from './types';

export const fileSystem = markRaw(new FileSystem('web_workbench_FS'));
export default class Files extends Module {
  static NAME = 'Files';
  fileSystem = fileSystem;
  fs = fileSystem;

  disks: DiskMap = {};

  constructor({ core }: ModuleConstructorOptions) {
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

  addDisks(disks: DiskList) {
    [...disks]
      .sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        } else if (a.order < b.order) {
          return -1;
        }
        return 0;
      })
      .forEach(disk => {
        this.disks[disk.name] = disk;
      });
  }
}
