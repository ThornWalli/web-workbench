import Module, { type ConstructorArgs } from '../../Module';
import FileSystem from '../../FileSystem/index';
import commands from './commands';
import contextMenu from './contextMenu';
import operationCommands from './commands/operations';
import cloudCommands from './commands/cloud';
import type Core from '../../Core';

export const fileSystem = new FileSystem('web_workbench_FS');
export default class Files extends Module {
  static NAME = 'Files';

  #disks: { [key: string]: unknown } = {};

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

  get disks() {
    return this.#disks;
  }

  async addDisks(diskMap: object) {
    Object.entries(diskMap).forEach(([name, disk]) => {
      this.#disks[String(name)] = disk;
    });
  }

  get fileSystem() {
    return fileSystem;
  }

  get fs() {
    return fileSystem;
  }
}

export { PROPERTY } from './property';
