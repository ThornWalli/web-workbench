import { kebabCase } from 'change-case';
class Cursor {
  name;
  constructor(name) {
    this.name = name;
  }

  getVars() {
    return [];
  }

  toCSSVars() {
    return this.getVars().reduce((result, name) => {
      result[`--${kebabCase(name)}`] = this[String(name)];
      return result;
    }, {});
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
    super(CURSOR_TYPES.POINTER_1);
  }
}
export class PointerMoonCity extends Cursor {
  constructor() {
    super(CURSOR_TYPES.POINTER_MOONCITY);
  }
}
export class Wait extends Cursor {
  constructor() {
    super(CURSOR_TYPES.WAIT);
  }
}
export class Crosshair extends Cursor {
  color = '#000';
  size = 2;
  constructor() {
    super(CURSOR_TYPES.CROSSHAIR);
  }

  getVars() {
    return ['color', 'size'];
  }
}
