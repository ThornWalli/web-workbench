/* eslint-disable complexity */
export interface Result {
  program: string | undefined;
  args: ArgumentData[];
  rawArgs: string[];
}

export interface Configuration {
  rawCommand: string;

  separator: string;

  hasProgram: boolean;
  activeArgument: ArgumentData | undefined;
  isLongArgument: boolean;
  isKeyWordArgument: boolean;
  isString: boolean;
  stringTmpValue: string | undefined;
  additionSpecial: boolean;

  isBufferWrite: boolean;
  isBufferValue: boolean;
  isBufferString: boolean;
  rawBuffer: string | undefined;

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

export function getDefaultConfig(
  options: Partial<Configuration>
): Configuration {
  return {
    rawCommand: '',

    hasProgram: false,
    activeArgument: undefined,
    isLongArgument: false,
    isKeyWordArgument: false,
    isString: false,
    stringTmpValue: undefined,
    additionSpecial: false,

    isBufferWrite: false,
    isBufferValue: false,
    isBufferString: false,
    rawBuffer: undefined,

    escaped: false,
    currentTick: DOUBLE_TICK,

    isClamp: false,
    ...options,

    separator: options.separator || SPACER
  };
}

export function parse(
  command: string,
  {
    separator,
    forceProgram
  }: { separator?: string; forceProgram?: boolean } = {}
): Result {
  const config: Configuration = getDefaultConfig({
    separator: separator || SPACER
  });
  command = `${String(command).trim()}${config.separator}`;
  config.rawCommand = command;

  const args: ArgumentData[] = [];
  while (config.rawCommand.length) {
    const char = config.rawCommand[0];
    config.rawCommand = config.rawCommand.slice(1);

    if (char === config.separator && !config.isClamp) {
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
      (char === PARAM_PREFIX ||
        (config.activeArgument && !config.isKeyWordArgument)) &&
      !config.isBufferWrite
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

  return extractResult(args, { forceProgram });
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

function extractResult(
  args: ArgumentData[],
  { forceProgram }: { forceProgram?: boolean } = {}
): Result {
  const programArg = args[0];

  let program: string | undefined;
  if (programArg && (isProgramArgument(programArg) || forceProgram)) {
    args = args.filter(arg => {
      return arg !== programArg;
    });
    program = programArg.value?.raw;
  }

  const rawArgs = [];
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

  return {
    program,
    args,
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
    if (!config.escaped && !config.isBufferValue && char !== config.separator) {
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
      (char !== config.currentTick ||
        config.isClamp ||
        (config.escaped && char === config.currentTick)) &&
      config.isBufferWrite
    ) {
      if (!config.isClamp && char === '+' && !config.additionSpecial) {
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
      value: config.rawBuffer,
      raw: `${config.currentTick}${config.rawBuffer}${config.currentTick}`
    };
  } else {
    let type = ValueType.ANY;
    let preparedValue: string | number | boolean = value;
    if (/^\d+$/.test(value)) {
      type = ValueType.INTEGER;
      preparedValue = Math.round(Number(value));
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      type = ValueType.DOUBLE;
      preparedValue = Number(value);
    } else if (/^[\d+\-*./A-Z$]+$/.test(value)) {
      type = ValueType.TERM;
      preparedValue = String(value).replace(/ /g, EMPTY);
    } else if (/^true|false$/.test(value)) {
      type = ValueType.BOOLEAN;
      preparedValue = value === 'true';
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
