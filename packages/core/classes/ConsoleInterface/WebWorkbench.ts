import { cleanString } from '../../utils/helper';
import { ConsoleInterface } from './index';
import type Core from '../Core';

export default class WebWorkbench extends ConsoleInterface {
  core: Core;

  constructor(core: Core) {
    super();
    this.core = core;
  }

  override prompt(message?: string) {
    const command = ['openDialog', '--prompt'];
    if (message) {
      command.push(`--message="${cleanString(message)}"`);
    }
    return this.core.executeCommand(command.join(' '));
  }
}
