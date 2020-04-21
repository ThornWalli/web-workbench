import ItemContainer from '../ItemContainer';

export default class Root extends ItemContainer {
  static NAME = 'Root';
  constructor (options) {
    options = Object.assign({}, options, { locked: true, id: 'ROOT' });
    super(options);
  }
}
