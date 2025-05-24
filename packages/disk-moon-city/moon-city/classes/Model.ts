import { v4 as uuidv4 } from 'uuid';

export interface ModelOptions {
  id?: string;
}

export interface ModelJSON {
  id: string;
}

export default class Model {
  id;

  constructor({ id }: ModelOptions = {}) {
    this.id = id || uuidv4();
  }

  toJSON(): ModelJSON {
    return {
      id: this.id
    };
  }
}
