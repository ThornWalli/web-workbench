import Module from '../../Module';
import FileSystem from '../../FileSystem/index';
import commands from './commands';
import contextMenu from './contextMenu';
import operationCommands from './commands/operations';
import cloudCommands from './commands/cloud';

export const fileSystem = new FileSystem('web_workbench_FS');
export default class Files extends Module {
  static NAME = 'Files';
  constructor ({ core }) {
    super({
      commands: (...args) => [
        ...commands(...args),
        ...operationCommands(...args),
        ...cloudCommands(...args)
      ],
      contextMenu,
      core
    });
  }

  get fileSystem () {
    return fileSystem;
  }

  get fs () {
    return fileSystem;
  }
}
