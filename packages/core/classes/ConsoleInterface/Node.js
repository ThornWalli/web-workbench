import { ConsoleInterface } from './index';

export default class Node extends ConsoleInterface {
  #readline;

  async ready() {
    if (!this.#readline) {
      const readline = await import('readline');
      this.#readline = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    return this.#readline;
  }

  prompt(message) {
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

  confirm(message) {
    this.log(message);
    return (
      this.ready()
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        .then(readline => {
          process.stdin.setRawMode(true);
          return new Promise(resolve =>
            process.stdin.once('data', () => {
              process.stdin.setRawMode(false);
              resolve();
            })
          );
        })
        .catch(err => {
          throw err;
        })
    );
  }

  log(...args) {
    console.log(...args);
    // process.stdout.write(Array(...args).join('') + '\n');
  }

  table(tableData) {
    console.log(tableData.toColumnify());
  }

  clear() {
    if (process && process.stdout && process.stdout.write) {
      process.stdout.write('\u001B[3J\u001B[2J\u001B[1J');
    }
  }

  destroy() {
    this.#readline.stop();
  }
}
