import { IPoint, ipoint } from '@js-basics/vector';
import { kebabCase } from 'change-case';
export class Cursor<TOptions extends BaseOptions = BaseOptions> {
  name: string;
  options: TOptions;
  constructor({ name, options }: { name: string; options: TOptions }) {
    this.name = name;
    this.options = options || ({} as TOptions);
  }

  toCSSVars() {
    return Object.entries(this.options).reduce(
      (result, [key, value]) => {
        if (value) {
          if (value instanceof IPoint) {
            result = { ...result, ...value.toCSSVars(kebabCase(key)) };
          } else {
            result[`--${kebabCase(key)}`] = value;
          }
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
    super({
      name: CURSOR_TYPES.POINTER_1,
      options: {
        dimension: ipoint(22, 22)
      }
    });
  }
}
export class PointerMoonCity extends Cursor {
  constructor() {
    super({
      name: CURSOR_TYPES.POINTER_MOONCITY,
      options: {
        dimension: ipoint(14, 26)
      }
    });
  }
}
export class Wait extends Cursor {
  constructor() {
    super({
      name: CURSOR_TYPES.WAIT,
      options: {
        dimension: ipoint(34, 48)
      }
    });
  }
}

type BaseOptions = Record<string, string | number | IPoint | undefined>;
interface CrosshairOptions extends BaseOptions {
  color?: string;
  size?: number;
  dimension: IPoint & number;
}

export class Crosshair extends Cursor<CrosshairOptions> {
  constructor() {
    super({
      name: CURSOR_TYPES.CROSSHAIR,
      options: {
        color: '#000',
        size: 2,
        dimension: ipoint(22, 22)
      }
    });
  }
}
