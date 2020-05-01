import { fillString, fill } from '../utils/string';

export default class CommandTester {
  #core;
  #commands = [];

  constructor (core) {
    this.#core = core;
  }

  command (value, targetValue) {
    this.#commands.push({
      value,
      targetValue
    });
  }

  run () {
    return Promise.all(this.#commands.map(({ value, targetValue }) => {
      return this.#core.executeCommand(value).then((result) => {
        const success = result === targetValue;
        if (!success) {
          console.error(`[ ${value} ]; ${result} === ${targetValue}`);
        }
        return {
          value,
          targetValue,
          result,
          success
        };
      });
    }));
  }

  async start () {
    const tests = await this.run();
    return [
      [
        tests.length, 'Tests processed'
      ],
      [
        tests.filter(test => test.success).length, 'Tests success'
      ],
      [
        tests.filter(test => !test.success).length, 'Tests failed'
      ]
    ];
  }
}

// function renderBox (title, lines) {
//   const width = 30;

//   const message = [
//     fill(width, '-'),
//       `| ${fillString(title, width - 4, false, ' ')} |`,
//       fill(width, '-'), ...lines.map(line => `| ${fillString(line, width - 4, false, ' ')} |`),
//       fill(width, '-')
//   ];
//   console.log(message.join('\n'));
// }
