import type { Table } from '@web-workbench/core/utils/console';
import { ConsoleInterface } from './index';
import Readline from 'readline';

export default class Node extends ConsoleInterface {
  private interface: Readline.Interface | undefined;

  override async ready() {
    if (!this.interface) {
      this.interface = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    return this.interface;
  }

  override prompt(message: string) {
    return this.ready()
      .then(readline => {
        return new Promise(resolve => {
          readline.question(message || '', value => {
            readline.pause();
            resolve(value);
          });
        });
      })
      .catch(err => {
        throw err;
      });
  }

  override confirm(message: string) {
    this.log(message);
    return (
      this.ready()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then(readline => {
          process.stdin.setRawMode(true);
          return new Promise<boolean>(resolve =>
            process.stdin.once('data', () => {
              process.stdin.setRawMode(false);
              resolve(true);
            })
          );
        })
        .catch(err => {
          throw err;
        })
    );
  }

  override table(tableData: Table) {
    console.log(tableData.toColumnify());
  }

  override clear() {
    if (process && process.stdout && process.stdout.write) {
      process.stdout.write('\u001B[3J\u001B[2J\u001B[1J');
    }
  }

  override destroy() {
    this.interface?.close();
  }
}
