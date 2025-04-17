import { kebabCase } from 'change-case';
class Cursor {
  name: string;
  options: Record<string, string | number>;
  constructor({
    name,
    options
  }: {
    name: string;
    options?: Record<string, string | number>;
  }) {
    this.name = name;
    this.options = options || {};
  }

  toCSSVars() {
    return Object.entries(this.options).reduce(
      (result, [key, value]) => {
        result[`--${kebabCase(key)}`] = value;
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
export class Crosshair extends Cursor {
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
