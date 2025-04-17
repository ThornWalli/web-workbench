import ItemContainer from '../ItemContainer';

export default class FloppyDisk extends ItemContainer {
  static TYPE = 'FloppyDisk';
  constructor(options: { name: string }) {
    super(options, { type: 'FloppyDisk' });
  }
}
