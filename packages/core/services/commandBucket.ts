import Bucket from '../classes/Bucket';
import type CommandContainer from '../classes/Command';

export class CommandBucket extends Bucket<CommandContainer> {
  constructor() {
    super('name');
  }
}

const commandBucket = new CommandBucket();
export default commandBucket;
