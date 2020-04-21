import Module from '../../Module';
import BasicInterpreter from '../../BasicInterpreter';
import Memory from '../../Memory';
import MathParser from '../../MathParser';
import CommandParser from '../../CommandParser';
import basicCommands from './commands';

export default class Parser extends Module {
  #basicInterpreter;
  #memory = new Memory();
  #mathParser= new MathParser(this.#memory);
  #commandParser= new CommandParser();

  constructor ({ core }) {
    super({
      commands: (...args) => [
        ...basicCommands(...args)
      ],
      core
    });
    this.#basicInterpreter = new BasicInterpreter(this.#memory, core.executeCommand.bind(core));
  }

  parse (...args) {
    return this.#basicInterpreter.parse(...args);
  }

  parseBasic (...args) {
    return this.#basicInterpreter.parse(...args);
  }

  parseCommand (...args) {
    return this.#commandParser.parse(...args);
  }

  parseMath (...args) {
    return this.#mathParser.parse(...args);
  }

  isMathValue (...args) {
    return this.#mathParser.validInput(...args);
  }
}
