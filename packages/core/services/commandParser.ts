/* eslint-disable complexity */
export interface Result {
  program: string | undefined;
  args: ArgumentData[];
  rawArgs: string[];
}

export interface Configuration {
  rawCommand: string;
  mergeArgs: boolean;
  mergeArgsBy: RegExp | string;

  separator: string;

  hasProgram: boolean;
  activeArgument: ArgumentData | undefined;
  isLongArgument: boolean;
  isKeyWordArgument: boolean;
  isString: boolean;
  stringTmpValue: string | undefined;
  additionSpecial: boolean;
  specialChar: string[];

  isBufferWrite: boolean;
  isBufferValue: boolean;
  isBufferString: boolean;
  rawBuffer: string | undefined;

  lastChar: string | undefined;
  isSeparating: boolean;

  escaped: boolean;
  currentTick: string;

  isClamp: boolean;
}

export interface ArgumentData {
  long?: boolean;
  plain?: boolean;
  name?: string;
  value?: Value;
}
export enum ValueType {
  STRING = 'string',
  ANY = 'any',
  INTEGER = 'integer',
  TERM = 'term',
  BOOLEAN = 'boolean',
  DOUBLE = 'double'
}

export interface Value {
  type: ValueType;
  raw?: string;
  value?: string | number | boolean | null;
}

function isSeperator(config: Configuration, char: string) {
  return config.separator === char;
}

export function getDefaultConfig(
  options: Partial<Configuration>
): Configuration {
  return {
    rawCommand: '',
    mergeArgs: false,
    mergeArgsBy: /^[+,]$/,

    hasProgram: false,
    activeArgument: undefined,
    isLongArgument: false,
    isKeyWordArgument: false,
    isString: false,
    stringTmpValue: undefined,
    additionSpecial: false,
    specialChar: ['+', ';', ','],

    isBufferWrite: false,
    isBufferValue: false,
    isBufferString: false,
    rawBuffer: undefined,

    lastChar: undefined,
    isSeparating: false,

    escaped: false,
    currentTick: DOUBLE_TICK,

    isClamp: false,
    ...options,

    separator: options.separator || SPACER
  };
}
const NEW_LINE = '[COMMAND_PARSER_NEW_LINE]';

export function parse(
  command: string,
  {
    separator,
    forceProgram,
    mergeArgs,
    mergeArgsBy
  }: {
    separator?: string;
    forceProgram?: boolean;
    mergeArgs?: boolean;
    mergeArgsBy?: RegExp | string;
  } = {}
): Result {
  const config: Configuration = getDefaultConfig({
    separator: separator || SPACER
  });

  command = command.replace('\\n', NEW_LINE);

  command = `${String(command).trim()}${config.separator}`;
  config.rawCommand = command;
  config.mergeArgs = mergeArgs || false;
  config.mergeArgsBy = mergeArgsBy || config.mergeArgsBy;

  const args: ArgumentData[] = [];
  while (config.rawCommand.length) {
    const char = config.rawCommand[0];
    config.rawCommand = config.rawCommand.slice(1);
    // const isLastChar = config.rawCommand.length === 0;
    const nextChar = config.rawCommand[0];

    if (isSeperator(config, nextChar)) {
      if (config.isSeparating && isSeperator(config, char)) {
        config.isSeparating = false;
      } else if (!config.isBufferWrite && isSeperator(config, char)) {
        config.isSeparating = true;
        continue;
      }
    } else {
      config.isSeparating = false;
    }

    if (
      (isSeperator(config, char) && !config.isClamp) ||
      config.rawCommand.length < 1
    ) {
      if (!config.escaped && config.isBufferValue && !config.isBufferString) {
        config.isBufferWrite = false;
      }
      if (!config.isBufferWrite) {
        if (config.isBufferValue) {
          applyRawValue(config);
        }
        if (config.activeArgument) {
          applyArgument(config, args);
          continue;
        }
      }
    }

    if (char === PARAM_EQUAL && config.activeArgument) {
      config.isKeyWordArgument = true;
      continue;
    } else if (
      ((char === PARAM_PREFIX &&
        (/[ +a-zA-Z]/.test(nextChar) || nextChar === PARAM_PREFIX)) ||
        (config.activeArgument && !config.isKeyWordArgument)) &&
      !config.isBufferWrite &&
      !config.specialChar.includes(char)
    ) {
      if (config.activeArgument) {
        if (!config.activeArgument?.name?.length && char === PARAM_PREFIX) {
          config.isLongArgument = true;
        } else {
          config.activeArgument.name += char;
        }
        continue;
      } else {
        config.activeArgument = { name: EMPTY };
        if (config.isLongArgument) {
          config.activeArgument.long = config.isLongArgument;
        }
        continue;
      }
    }

    resolveChar(config, char);
  }

  return extractResult(args, { forceProgram, mergeArgs, mergeArgsBy });
}
function isProgramArgument(arg: ArgumentData): boolean {
  return (
    (arg.value?.type === ValueType.ANY &&
      !arg.name &&
      arg.value?.raw &&
      /^[a-zA-Z]+$/.test(arg.value?.raw)) ||
    false
  );
}

function isConcatChar(arg: ArgumentData): boolean {
  return arg.value?.raw === '+';
}
function mergeArgsByValue(
  args: ArgumentData[],
  mergeBy: RegExp | string = /^[+]$/
) {
  return args.reduce((result, arg) => {
    const lastValue = result[result.length - 1]?.value?.raw;
    const lastChar = lastValue && lastValue[String(lastValue).length - 1];
    if (
      (typeof mergeBy === 'string' &&
        (String(arg.value?.raw) === mergeBy || String(lastChar) === mergeBy)) ||
      (mergeBy instanceof RegExp &&
        (mergeBy.test(String(arg.value?.raw)) ||
          mergeBy.test(String(lastChar))))
    ) {
      const value = result[result.length - 1].value;
      if (value && value.raw && typeof value.value === 'string') {
        value.raw += arg.value?.raw;
        value.value += arg.value?.value || '';
        value.type = ValueType.ANY;
      }
      // result[result.length - 1] = (result[result.length - 1] || '') + value;
    } else {
      result.push(arg);
    }
    return result;
  }, Array<ArgumentData>());
}

function getRawArgs(program: string | undefined, args: ArgumentData[]) {
  const rawArgs: string[] = [];
  if (program) {
    rawArgs.push(program);
  }
  rawArgs.push(
    ...args.map(arg => {
      if (arg.plain) {
        return arg.value?.raw || arg.name || EMPTY;
      } else {
        const prefix = arg.long ? '--' : '-';
        const name = arg.name || EMPTY;
        const value = arg.value?.raw || EMPTY;
        const valuePrefix = !arg.value ? '' : PARAM_EQUAL;
        return `${prefix}${name}${valuePrefix}${value}`;
      }
    })
  );
  return rawArgs;
}

function extractResult(
  args: ArgumentData[],
  {
    forceProgram,
    mergeArgs,
    mergeArgsBy
  }: {
    forceProgram?: boolean;
    mergeArgs?: boolean;
    mergeArgsBy?: string | RegExp;
  } = {}
): Result {
  const programArg = args[0];
  const nextArg = args[1];

  let program: string | undefined;
  if (
    (!nextArg || !isConcatChar(nextArg)) &&
    programArg &&
    (isProgramArgument(programArg) || forceProgram)
  ) {
    args = args.filter(arg => {
      return arg !== programArg;
    });
    program = programArg.value?.raw;
  }

  let preparedArgs = args;
  if (mergeArgs) {
    preparedArgs = mergeArgsByValue(args, mergeArgsBy);
  }

  const rawArgs = getRawArgs(program, preparedArgs);
  return {
    program: program?.replace(NEW_LINE, '\n'),
    args: preparedArgs,
    rawArgs
  };
}

const ESCAPE_PREFIX = '\\';
const EMPTY = '';
const SPACER = ' ';
const PARAM_PREFIX = '-';
const PARAM_EQUAL = '=';

const DOUBLE_TICK = '"';
const SINGLE_TICK = "'";

function isEscapePrefixChar(char: string) {
  return char === ESCAPE_PREFIX;
}

function resolveChar(config: Configuration, char: string) {
  if (!isEscapePrefixChar(char)) {
    if (
      !config.escaped &&
      !config.isBufferValue &&
      !isSeperator(config, char)
    ) {
      config.isBufferWrite = true;
      config.isBufferValue = true;

      if ((char === SINGLE_TICK || char === DOUBLE_TICK) && !config.isClamp) {
        config.currentTick = char;
        config.isBufferString = true;
      }

      config.isBufferString = char === config.currentTick;
      config.rawBuffer = undefined;
      config.activeArgument = config.activeArgument || {
        value: undefined,
        plain: true
      };
    } else {
      if (
        char === config.currentTick &&
        config.isBufferString &&
        !config.escaped &&
        !config.isClamp
      ) {
        config.isBufferWrite = false;
      }
    }
    if (
      char !== config.currentTick ||
      config.isClamp ||
      (config.escaped && char === config.currentTick)
    ) {
      if (
        ((!config.isBufferWrite && config.isBufferString) ||
          (config.isBufferWrite && !config.isBufferString)) &&
        !config.isClamp &&
        config.specialChar.includes(char) &&
        !config.additionSpecial
      ) {
        config.rawCommand = ' ' + char + ' ' + config.rawCommand;
        config.additionSpecial = true;
      } else {
        config.additionSpecial = false;
        config.rawBuffer = (config.rawBuffer || '') + char;
      }
    }

    config.escaped = false;
  } else {
    config.escaped = true;
  }

  if (config.isBufferWrite) {
    if (char === '(') {
      config.isClamp = true;
    } else if (char === ')') {
      config.isClamp = false;
    }
  }
  config.lastChar = char;
}

function isEmptyArgument(data: ArgumentData) {
  return (
    data.plain &&
    !data.name &&
    data.value?.type === ValueType.ANY &&
    (data.value?.raw === undefined || data.value?.raw === EMPTY)
  );
}

function applyArgument(config: Configuration, args: ArgumentData[]) {
  if (config.activeArgument) {
    if (config.isLongArgument) {
      config.activeArgument.long = config.isLongArgument;
    }

    if (!isEmptyArgument(config.activeArgument)) {
      args.push(config.activeArgument);
    }
  }
  config.activeArgument = undefined;
  config.isLongArgument = false;
  config.isKeyWordArgument = false;
}

function applyRawValue(config: Configuration) {
  const value = config.rawBuffer || EMPTY;

  if (config.isBufferString) {
    config.activeArgument!.value = {
      type: ValueType.STRING,
      value: config.rawBuffer?.replace(NEW_LINE, '\n'),
      raw: `${config.currentTick}${config.rawBuffer?.replace(NEW_LINE, '\n') || ''}${config.currentTick}`
    };
  } else {
    let type = ValueType.ANY;
    let preparedValue: string | number | boolean = value;
    if (/^[+-]?\d+$/.test(value)) {
      type = ValueType.INTEGER;
      preparedValue = Math.round(Number(value));
    } else if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) {
      type = ValueType.DOUBLE;
      preparedValue = Number(value);
    } else if (/^true|false$/.test(value)) {
      type = ValueType.BOOLEAN;
      preparedValue = value === 'true';
    } else if (/^[a-zA-Z$]+$/.test(value)) {
      type = ValueType.ANY;
      preparedValue = String(value).replace(/ /g, EMPTY);
    } else if (/^[\d+\-*./a-zA-Z$]+$/.test(value)) {
      type = ValueType.TERM;
      preparedValue = String(value).replace(/ /g, EMPTY);
    }
    config.activeArgument!.value = {
      type,
      value: preparedValue,
      raw: config.rawBuffer
    };
  }
  config.rawBuffer = undefined;
  config.isBufferValue = false;
  config.isBufferString = false;
}
