import { ArgumentInfo, type ActionOptionsArgument } from '../../Command';
import errorMessage from '../../../services/errorMessage';
import basicExamples from './examples.json';
import type Core from '../../Core';
import type Parser from '.';

export default ({ module, core }: { module: Parser; core: Core }) => {
  return [
    {
      name: ['basic'],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to basic script'
        })
      ],
      async action(
        {
          path
        }: {
          path: string;
        },
        options: ActionOptionsArgument
      ) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }

        const item = await core.modules.files?.fileSystem.get(path);

        if (
          'type' in item.data &&
          item.data.type === 'basic' &&
          Array.isArray(item.data.content)
        ) {
          return module.parseBasic(item.data.content, undefined, {
            logger: options.logger
          });
        } else {
          throw new TypeError(`Can't read file ${path}`);
        }
      }
    },
    {
      name: ['basicExamples'],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'name',
          description: 'Name from example'
        })
      ],
      action({ name }: { name: string }) {
        return module.parseBasic(
          (basicExamples as { [key: string]: string[] })[String(name)]
        );
      }
    }
  ];
};
