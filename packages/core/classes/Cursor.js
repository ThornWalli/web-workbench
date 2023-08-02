class Cursor {
  name;
  constructor (name) {
    this.name = name;
  }

  getVars () {
    return [];
  }

  toCSSVars () {
    return this.getVars().reduce((result, name) => { result[`--${name}`] = this[String(name)]; return result; }, {});
  }
}

export const CURSOR_TYPES = {
  POINTER_1: 'pointer_1',
  POINTER_2: 'pointer_2',
  WAIT: 'wait',
  CROSSHAIR: 'crosshair'
};

export class PointerA extends Cursor {
  constructor () {
    super(CURSOR_TYPES.POINTER_1);
  }
}
export class PointerB extends Cursor {
  constructor () {
    super(CURSOR_TYPES.POINTER_2);
  }
}
export class Wait extends Cursor {
  constructor () {
    super(CURSOR_TYPES.WAIT);
  }
}
export class Crosshair extends Cursor {
  focusColor;
  focusSize = 2;
  constructor () {
    super(CURSOR_TYPES.CROSSHAIR);
  }

  getVars () {
    return [
      'focusColor', 'focusSize'
    ];
  }
}
