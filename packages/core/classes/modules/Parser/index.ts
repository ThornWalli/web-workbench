import Module from '../../Module';
import BasicInterpreter from '../../BasicInterpreter';
import Memory from '../../Memory';
import MathParser from '../../MathParser';
import CommandParser from '../../CommandParser';
import basicCommands from './commands';
import type Core from '../../Core';
import type { ParsedCommand } from '../../Command';

export default class Parser extends Module {
  #basicInterpreter;
  #memory = new Memory();
  #mathParser = new MathParser(this.#memory);
  #commandParser = new CommandParser(this.#mathParser);

  constructor({ core }: { core: Core }) {
    super({
      name: 'Parser',
      commands: (options: { module: Parser; core: Core }) => [
        ...basicCommands(options)
      ],
      core
    });
    this.#basicInterpreter = new BasicInterpreter(
      this.#memory,
      core.executeCommand.bind(core)
    );
  }

  get memory() {
    return this.#memory;
  }

  parse(lines: string[], callback: CallableFunction, optionsOverride: object) {
    return this.#basicInterpreter.parse(lines, callback, optionsOverride);
  }

  parseBasic(
    lines: string | string[],
    callback?: CallableFunction,
    optionsOverride: object = {}
  ) {
    let normalizeLines: string[] = lines as string[];
    if (!Array.isArray(lines)) {
      normalizeLines = lines.split('\n');
    }
    return this.#basicInterpreter.parse(
      normalizeLines,
      callback,
      optionsOverride
    );
  }

  parseCommand(input: string): Promise<ParsedCommand> {
    return this.#commandParser.parse(input);
  }

  parseMath(input: string) {
    return this.#mathParser.parse(input);
  }

  isMathValue(input: string) {
    return this.#mathParser.validInput(input);
  }
}
