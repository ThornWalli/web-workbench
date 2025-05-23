import { ArgumentInfo, defineCommands } from '../../classes/Command';
import errorMessage from '../../services/errorMessage';
import basicExamples from './examples.json';
import type Core from '../../classes/Core';
import type Parser from '.';
import type { ItemData } from '../../classes/FileSystem/types';

export default defineCommands<{ module: Parser; core: Core }>(
  ({ module, core }) => {
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
          options
        ) {
          if (!path) {
            throw errorMessage.get('bad_args');
          }

          const item = await core.modules.files?.fileSystem.get(path);

          if (typeof item?.data === 'object') {
            const data = item.data as ItemData;
            if (data.type === 'basic' && Array.isArray(data.content)) {
              return module.parseBasic(data.content, undefined, {
                logger: options.logger
              });
            }
          } else {
            throw new Error(`Can't read file ${path}`);
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
  }
);
