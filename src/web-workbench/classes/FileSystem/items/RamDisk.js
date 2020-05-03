import { SYMBOL } from '../../../utils/symbols';
import Storage from './Storage';

export default class RamDisk extends Storage {
  static NAME = 'RamDisk';
  static SYMBOL = SYMBOL.RAM_DISK;
}
