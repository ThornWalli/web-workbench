import { v4 as uuidv4 } from 'uuid';

export default class Model {
  id;

  constructor({ id } = {}) {
    this.id = id || uuidv4();
  }

  toJSON() {
    return {
      id: this.id
    };
  }
}
