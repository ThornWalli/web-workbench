export interface ModelOptions {
  id?: string;
}

export interface ModelJSON {
  id: string;
}

export default class Model {
  id;

  constructor({ id }: ModelOptions = {}) {
    this.id = id || crypto.randomUUID();
  }

  toJSON(): ModelJSON {
    return {
      id: this.id
    };
  }
}
