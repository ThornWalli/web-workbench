import Module, { type ModuleConstructorOptions } from '../../classes/Module';
import BasicInterpreter, {
  type ParseCallbackOptions
} from '../../classes/BasicInterpreter';
import Memory from '../../classes/Memory';
import MathParser from '../../classes/MathParser';
import CommandParser from '../../classes/CommandParser';

import basicCommands from './commands';
import type Core from '../../classes/Core';
import type { CommandResult } from '../../classes/Command';
import './types';
import { markRaw } from 'vue';

export default class Parser extends Module {
  basicInterpreter;
  memory = markRaw(new Memory());
  mathParser = markRaw(new MathParser(this.memory));
  commandParser = markRaw(new CommandParser());

  constructor({ core }: ModuleConstructorOptions) {
    super({
      name: 'Parser',
      commands: (options: { module: Parser; core: Core }) => [
        ...basicCommands(options)
      ],
      core
    });
    this.basicInterpreter = markRaw(
      new BasicInterpreter(this.memory, core.executeCommand.bind(core))
    );
  }

  parse(lines: string[], callback: CallableFunction, optionsOverride: object) {
    return this.basicInterpreter.parse(lines, callback, optionsOverride);
  }

  parseBasic(
    lines: string | string[],
    callback?: (value: string, options: ParseCallbackOptions) => void,
    optionsOverride: object = {}
  ) {
    let normalizeLines: string[] = lines as string[];
    if (!Array.isArray(lines)) {
      normalizeLines = lines.split('\n');
    }
    return this.basicInterpreter.parse(
      normalizeLines,
      callback,
      optionsOverride
    );
  }

  async parseCommand(input: string): Promise<CommandResult> {
    return this.commandParser.parse(input);
  }

  parseMath(input: string) {
    return this.mathParser.parse(input);
  }

  isMathValue(input: string) {
    return this.mathParser.validInput(input);
  }
}
