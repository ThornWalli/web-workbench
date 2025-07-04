import { kebabCase } from 'change-case';
export class Cursor<TOptions extends BaseOptions = BaseOptions> {
  name: string;
  options: TOptions;
  constructor({ name, options }: { name: string; options?: TOptions }) {
    this.name = name;
    this.options = options || ({} as TOptions);
  }

  toCSSVars() {
    return Object.entries(this.options).reduce(
      (result, [key, value]) => {
        if (value) {
          result[`--${kebabCase(key)}`] = value;
        }
        return result;
      },
      {} as Record<string, string | number>
    );
  }
}

export const CURSOR_TYPES = {
  POINTER_1: 'pointer_1',
  POINTER_MOONCITY: 'pointer_mooncity',
  WAIT: 'wait',
  CROSSHAIR: 'crosshair'
};

export class PointerA extends Cursor {
  constructor() {
    super({ name: CURSOR_TYPES.POINTER_1 });
  }
}
export class PointerMoonCity extends Cursor {
  constructor() {
    super({ name: CURSOR_TYPES.POINTER_MOONCITY });
  }
}
export class Wait extends Cursor {
  constructor() {
    super({ name: CURSOR_TYPES.WAIT });
  }
}

type BaseOptions = Record<string, string | number | undefined>;
interface CrosshairOptions extends BaseOptions {
  color?: string;
  size?: number;
}

export class Crosshair extends Cursor<CrosshairOptions> {
  constructor() {
    super({
      name: CURSOR_TYPES.CROSSHAIR,
      options: {
        color: '#000',
        size: 2
      }
    });
  }
}
