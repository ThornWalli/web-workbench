import { camelCase } from 'change-case';

export default class CommandContainer {
  #name;
  #description;
  #args = [];
  #action;
  constructor ({ name, description, args, action }) {
    this.#name = [].concat(name);
    this.#description = description;
    this.#args = args || this.#args;
    this.#action = action;
  }

  action (...args) {
    return this.#action(...args);
  }

  get description () {
    return this.#description;
  }

  get name () {
    return this.#name;
  }

  get args () {
    return this.#args;
  }
}

export function generateCommands (commands) {
  return commands.map(command => new CommandContainer(command));
}

export function parseParsedCommand (command, parsedInput) {
  // eslint-disable-next-line complexity
  return command.args.reduce((result, arg) => {
    const name = [].concat(arg.name);
    if (name.length < 1) {
      name.push = `argument-${arg.index}`;
    }
    const primaryArgName = camelCase(arg.name[0]);

    if ('index' in arg && arg.index !== undefined && Number(arg.index) in parsedInput.args) {
      // has index
      const index = arg.index;
      let value = parsedInput.args[Number(index)];
      value = value === undefined ? true : value;
      result[Number(index)] = value;
      result[String(primaryArgName)] = value;
    }
    name.forEach((name) => {
      if (name in parsedInput.kwargs) {
        const value = parsedInput.kwargs[String(name)];
        result[String(primaryArgName)] = value === undefined ? true : value;
        // if (arg.index !== undefined) {
        //   result[Number(arg.index)] = value;
        // }
      }
    });

    return result;
  }, {});
}

export class ArgumentInfo {
  #name;
  #index;
  #flag;
  #description;

  constructor ({ name, index, flag, description }) {
    this.#name = [].concat(name);
    this.#index = index;
    this.#flag = flag;
    this.#description = description;
  }

  get name () {
    return this.#name;
  }

  get index () {
    return this.#index;
  }

  get flag () {
    return this.#flag;
  }

  get description () {
    return this.#description;
  }
}
