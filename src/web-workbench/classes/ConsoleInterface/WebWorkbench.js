import { ConsoleInterface } from './index';
import { cleanString } from '@/web-workbench/utils/helper';

export default class WebWorkbench extends ConsoleInterface {
  prompt (message) {
    const command = [
      'openDialog', '--prompt'
    ];
    if (message) {
      command.push(`--message="${cleanString(message)}"`);
    }
    return this.core.executeCommand(command.join(' '));
  }
}
