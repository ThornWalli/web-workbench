import Bucket from '../classes/Bucket';

export class CommandBucket extends Bucket {
  constructor() {
    super('name');
  }
}

const commandBucket = new CommandBucket();
export default commandBucket;
