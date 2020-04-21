
import { ArgumentInfo } from '../../Command';
import errorMessage from '../../../services/errorMessage';
import basicExamples from './examples';

export default ({ module, core }) => {
  const { fileSystem } = core.modules.files;
  return [
    {
      name: [
        'basic'
      ],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to basic script'
        })
      ],
      async action ({ path }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);

        if ('type' in item.data && item.data.type === 'basic' && Array.isArray(item.data.content)) {
          return module.parseBasic(item.data.content, null, { logger: options.logger });
        } else {
          throw new TypeError(`Can't read file ${path}`);
        }
      }
    },
    {
      name: [
        'basicExamples'
      ],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'name',
          description: 'Name from example'
        })
      ],
      action ({ name }) {
        return module.parseBasic(basicExamples[String(name)]);
      }
    }

  ];
};
