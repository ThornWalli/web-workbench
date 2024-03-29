import { cleanString } from '../../utils/helper';
import { ConsoleInterface } from './index';

export default class WebWorkbench extends ConsoleInterface {
  prompt(message) {
    const command = ['openDialog', '--prompt'];
    if (message) {
      command.push(`--message="${cleanString(message)}"`);
    }
    return this.core.executeCommand(command.join(' '));
  }
}
