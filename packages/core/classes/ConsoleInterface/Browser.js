import { ConsoleInterface } from './index';

export default class Browser extends ConsoleInterface {
  prompt(message) {
    return Promise.resolve(window.prompt(message));
  }
}
