import { ConsoleInterface } from './index';

export default class Browser extends ConsoleInterface {
  override async prompt(message: string) {
    return window.prompt(message);
  }
}
