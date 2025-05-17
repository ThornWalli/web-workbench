import { ipoint } from '@js-basics/vector';
import { markRaw, reactive, toRaw } from 'vue';

import { ArgumentInfo, defineCommands } from '../../../Command';
import { Table as ConsoleTable } from '../../../../utils/console';
import {
  stripByteString,
  fillString,
  formatDate
} from '../../../../utils/string';
import ItemContainer from '../../../FileSystem/ItemContainer';
import ItemDirectory from '../../../FileSystem/items/Directory';

import Storage from '../../../FileSystem/items/Storage';
import { addExt } from '../../../../utils/fileSystem';

import type Core from '../../../../classes/Core';
import type Files from '../index';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '../../Windows/utils';
import type { EventValue } from '@web-workbench/core/classes/Event';
import type {
  Model as ModelOpenDialog,
  SELECT_TYPE
} from '../../../../components/modules/files/Open.vue';

async function saveFile(core: Core, path: string, data: string) {
  const exist = await core.executeCommand(`exist "${path}"`);

  let override = false;
  if (exist) {
    override = await core.executeCommand(
      'openDialog "File exist, overwrite?" --confirm'
    );
  }
  const command = [`makefile "${path}"`];

  if (data) {
    command.push(`--data="${data}"`);
  }
  if (override) {
    command.push('--override');
  } else {
    command.push('--ignore');
  }

  return core.executeCommand(command.join(' '));
}

async function readFile(core: Core, path: string) {
  const fsItem = await core.modules.files?.fs.get(path);
  const value = await core.executeCommand(`readfile "${path}"`);
  return {
    fsItem,
    value
  };
}

export default defineCommands<{ module: Files; core: Core }>(
  ({ module, core }) => {
    const { fileSystem } = module;

    return [
      {
        name: 'openPreview',
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'path',
            description: 'Path to the file'
          }),
          new ArgumentInfo({
            name: 'maximized',
            description: 'If set, window is maximized.'
          })
        ],
        async action({
          path,
          maximized
        }: {
          path: string;
          maximized?: boolean;
        }) {
          const item = await fileSystem.get(path);
          const { type, content, openMaximized } = item.data;
          if (
            type === 'basic' &&
            !item.data[WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]
          ) {
            await core.modules.parser?.parseBasic(
              content,
              async (value: string, options: object) => {
                const parsedValue = await core.executeCommand(value, options);
                return parsedValue;
              }
            );
          } else {
            const component = await import(
              '../../../../components/modules/files/Preview.vue'
            ).then(module => module.default);
            core.modules.windows?.addWindow(
              {
                component,
                componentData: { type, content },
                options: {
                  title: item.name,
                  scaleX: true,
                  scaleY: true,
                  scrollX: true,
                  scrollY: true
                },
                layout: {
                  size: ipoint(420, 360)
                }
              },
              {
                full: openMaximized || maximized || false
              }
            );
          }
        }
      },

      {
        name: 'saveFileDialog',
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'data',
            description: 'File Content'
          }),
          new ArgumentInfo({
            index: 1,
            name: 'id',
            description: 'File Id'
          }),
          new ArgumentInfo({
            index: 2,
            name: 'extension',
            description: 'File Extension'
          })
        ],
        async action({
          data,
          id,
          extension
        }: {
          data: string;
          id: string;
          extension: string;
        }) {
          const component = await import(
            '../../../../components/modules/files/Save.vue'
          ).then(module => module.default);
          const window = core.modules.windows?.addWindow({
            component,
            componentData: {
              fsItem: fileSystem.root && markRaw(fileSystem.root),
              id
            },
            options: {
              title: 'Save File',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          });
          if (window) {
            const { value } = await window.awaitClose<string & EventValue>();
            if (value) {
              const path = addExt(value, extension);
              const file = await saveFile(core, path, data);
              if (file) {
                return markRaw(toRaw(file));
              }
            }
          }
        }
      },

      {
        name: 'openFileDialog',
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'type',
            description: 'Type for File or Directory to open.'
          })
        ],
        async action({ type }: { type: SELECT_TYPE }) {
          const model: ModelOpenDialog = reactive({});
          const component = await import(
            '../../../../components/modules/files/Open.vue'
          ).then(module => module.default);
          const window = core.modules.windows?.addWindow({
            component,
            componentData: {
              type,
              model,
              fsItem: fileSystem.root && markRaw(fileSystem.root)
            },
            options: {
              title: 'Open File',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          });
          if (window) {
            const { value: path } = await window.awaitClose<
              string & EventValue
            >();
            return path && readFile(core, path);
          }
        }
      },

      {
        name: 'fileinfo',
        description: 'Get info from File or Directory',
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'path',
            description: 'Path to the file'
          }),
          new ArgumentInfo({
            index: 1,
            name: 'name',
            description: 'Name from the Info'
          }),
          new ArgumentInfo({
            index: 2,
            name: ['list', 'ls'],
            flag: true,
            description: 'List all Infos'
          })
        ],

        async action(
          { path, name, list }: { path: string; name: string; list?: boolean },
          options
        ) {
          const meta = await fileSystem.getItemMetaList(path);
          if (list) {
            const table = new ConsoleTable();
            table.addColumns([
              {
                value: 'Name',
                align: 'left',
                minWidth: 20
              },
              {
                value: 'Value',
                align: 'left',
                minWidth: 20
              }
            ]);
            table.addRows(
              meta.map(({ name, value }) => {
                let preparedValue = value;
                if (Array.isArray(value)) {
                  preparedValue = value.join(' ');
                }
                return [name, preparedValue as string | number];
              })
            );
            options.message([table]);
          } else {
            return meta.find(item => item.name === name);
          }
        }
      },

      {
        name: ['info', 'i'],
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'path',
            description: 'Path to the file'
          })
        ],
        async action({ path }: { path: string }, options) {
          let item = fileSystem.root;
          if (path) {
            item = await fileSystem.get(path);
          }
          if (item?.parent) {
            item = item.parent;
          }
          const itemMap = await item?.getItems();
          const table = new ConsoleTable();
          table.addColumns([
            {
              value: 'Unit',
              align: 'left',
              minWidth: 8
            },
            {
              value: 'Size',
              align: 'right',
              minWidth: 6
            },
            {
              value: 'Used',
              align: 'right',
              minWidth: 6
            },
            {
              value: 'Free',
              align: 'right',
              minWidth: 6
            },
            {
              value: 'Full',
              minWidth: 4
            },
            {
              value: 'Errs',
              align: 'center',
              minWidth: 4
            },
            {
              value: 'Status',
              align: 'center',
              minWidth: 10
            },
            {
              value: 'Name',
              align: 'right',
              minWidth: 14
            }
          ]);
          const items = Array.from(itemMap?.values() || []).filter(
            item => item instanceof Storage
          );
          table.addRows(
            items.map(item => {
              let percentUsedValue = 0;
              if (item.size > 0 || item.maxSize > 0) {
                percentUsedValue = (item.size / item.maxSize) * 100;
              }

              return [
                `${item.id}:`,
                stripByteString(item.maxSize),
                stripByteString(item.size),
                stripByteString(item.maxSize - item.size),
                `${percentUsedValue}%`,
                '0',
                item.locked ? 'Read' : 'Read/Write',
                `${item.name || ''}`
              ];
            })
          );
          const messages = [
            '',
            'Mounted disks:',
            table,
            '',
            'Volumes available:'
          ];
          items.forEach(item => {
            messages.push(`${item.name}: [Mounted]`);
          });
          messages.push('');
          options.message(messages);
        }
      },

      {
        name: ['list', 'ls'],
        args: [
          new ArgumentInfo({
            index: 0,
            name: 'path',
            description: 'Path to the file'
          }),
          new ArgumentInfo({
            name: 'dir-size',
            flag: true,
            description: 'Show Directory Size.'
          })
        ],
        async action(
          { path, dirSize }: { path: string; dirSize: boolean },
          options
        ) {
          let item = fileSystem.currentItem;
          if (path) {
            item = await fileSystem.get(path);
          }
          const items = Array.from(
            ((await (item as ItemContainer)?.getItems()) || []).values()
          );

          const table = new ConsoleTable();
          table.addColumns([
            {
              value: 'Name',
              align: 'left',
              minWidth: 26
            },
            {
              value: 'Size',
              align: 'right',
              minWidth: 8
            },
            {
              value: 'Access',
              align: 'center',
              minWidth: 12
            },
            {
              value: 'Date / Time',
              align: 'center',
              minWidth: 18
            }
          ]);
          table.addRows(
            items.reduce((result, item) => {
              let size;
              if (item instanceof ItemContainer && !dirSize) {
                size = 'DIR';
              } else {
                size = fillString(stripByteString(item.size), 8, true, '0');
              }
              const access = item.isLocked() ? 'Read' : 'Read/Write';
              result.push([
                `${item.id}:`,
                size,
                access,
                item.createdDate
                  ? formatDate('D-mm-y H:I:S', item.createdDate)
                  : ''
              ]);
              return result;
            }, [] as string[][])
          );
          const directoriesCount = items.reduce((result, item) => {
            if (item instanceof ItemDirectory) {
              result++;
            }
            return result;
          }, 0);
          const blockCount = items.reduce((result, item) => {
            result += item.size;
            return result;
          }, 0);

          options.message([
            table,
            `${items.length} files - ${directoriesCount} directories - ${blockCount} blocks used`
          ]);

          return Promise.resolve();
        }
      }
    ];
  }
);
