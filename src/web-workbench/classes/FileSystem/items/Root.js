import ItemContainer from '../ItemContainer';

export default class Root extends ItemContainer {
  constructor (options) {
    options = Object.assign({}, options, { locked: true, id: 'ROOT' });
    super(options);
  }
}
