import { ipoint } from '@js-basics/vector';
import { PROPERTY as EXTRAS13_PROPERTY } from '@/web-workbench/disks/extras13/utils';
import { addExt } from '@/web-workbench/utils/fileSystem';
import Storage from '@/web-workbench/classes/FileSystem/items/Storage';
import { ArgumentInfo } from '../../../Command';
import { Table as ConsoleTable } from '../../../../utils/console';
import { stripByteString, fillString, formatDate } from '../../../../utils/string';
import ItemContainer from '../../../FileSystem/ItemContainer';
import ItemDirectory from '../../../FileSystem/items/Directory';

import WbModuleFilesSave from '../../../../../components/modules/files/Save';
import WbModuleFilesOpen from '../../../../../components/modules/files/Open';
import WbModuleFilesPreview from '../../../../../components/modules/files/Preview';

async function saveFile (core, path, data) {
  const exist = await core.executeCommand(`exist "${path}"`);

  let override = false;
  if (exist) {
    override = await core.executeCommand('openDialog "File exist, overwrite?" --confirm');
  }
  const command = [
        `makefile "${path}"`
  ];

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

async function readFile (core, path) {
  const fsItem = await core.modules.files.fs.get(path);
  const value = await core.executeCommand(`readfile "${path}"`);
  return {
    fsItem,
    value
  };
}

export default ({ module, core }) => {
  const windowsModule = core.modules.windows;
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
      async  action ({ path, maximized }) {
        const item = await fileSystem.get(path);
        const { type, content, openMaximized } = item.data;
        if (type === 'basic' && !item.data[EXTRAS13_PROPERTY.HAS_WINDOW_OUTPUT]) {
          await core.modules.parser.parseBasic(content, async (value, options) => {
            const parsedValue = await core.executeCommand(value, options);
            return parsedValue;
          });
        } else {
          windowsModule.addWindow({
            title: item.name,
            component: WbModuleFilesPreview,
            componentData: { type, content },
            options: {
              scale: true,
              scrollX: true,
              scrollY: true
            },
            layout: {
              size: ipoint(420, 360)
            }
          }, {
            full: openMaximized || maximized || false
          });
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
      action ({ data, id, extension }) {
        const window = windowsModule.addWindow({
          title: 'Save File',
          component: WbModuleFilesSave,
          componentData: { fsItem: fileSystem.root, id },
          options: {
            scale: false,
            scrollX: false,
            scrollY: false
          }
        });

        return new Promise((resolve) => {
          window.events.subscribe(({ name, value }) => {
            if (name === 'close') {
              if (value) {
                const path = addExt(value, extension);
                return saveFile(core, path, data).then(resolve);
              }
              resolve();
            }
          });
        });
      }
    },
    {
      name: 'openFileDialog',
      args: [],
      action ({ data }) {
        const window = windowsModule.addWindow({
          title: 'Open File',
          component: WbModuleFilesOpen,
          componentData: { fsItem: fileSystem.root },
          options: {
            scale: false,
            scrollX: false,
            scrollY: false
          }
        });
        return new Promise((resolve) => {
          window.events.subscribe(({ name, value }) => {
            if (name === 'close') {
              if (value) {
                const path = value;
                return readFile(core, path).then(resolve);
              }
              resolve(value);
            }
          });
        });
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
          name: [
            'list', 'ls'
          ],
          flag: true,
          description: 'List all Infos'
        })
      ],
      async action ({ path, name, list }, options) {
        const meta = await fileSystem.itemMeta(path, name, list);
        if (Array.isArray(meta)) {
          const table = new ConsoleTable();
          table.addColumn({
            value: 'Name',
            align: 'left',
            minWidth: 20
          });
          table.addColumn({
            value: 'Value',
            align: 'left',
            minWidth: 20
          });
          table.addRow(meta.map((item) => {
            let val = item.value;
            if (Array.isArray(val)) {
              val = val.join(' ');
            }
            return [
              item.name, val
            ];
          }));
          options.message([
            table
          ]);
        }
        return meta;
      }
    },
    {
      name: [
        'info', 'i'
      ],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the file'
        })
      ],
      async action ({ path }, options) {
        let item = fileSystem.root;
        if (path) {
          item = await fileSystem.get(path);
        }
        if (!(item instanceof ItemContainer)) {
          item = item.parent;
        }
        let items = await item.getItems();
        const table = new ConsoleTable();
        table.addColumn([
          {
            value: 'Unit',
            align: 'left',
            minWidth: 8
          }, {
            value: 'Size',
            align: 'right',
            minWidth: 6
          }, {
            value: 'Used',
            align: 'right',
            minWidth: 6
          }, {
            value: 'Free',
            align: 'right',
            minWidth: 6
          }, {
            value: 'Full',
            minWidth: 4
          }, {
            value: 'Errs',
            align: 'center',
            minWidth: 4
          }, {
            value: 'Status',
            align: 'center',
            minWidth: 10
          }, {
            value: 'Name',
            align: 'right',
            minWidth: 14
          }
        ]);
        items = Array.from(items.values()).filter(item => item instanceof Storage);
        table.addRow(
          items.map((item) => {
            let percentUsedValue = 0;
            if (item.size > 0 || item.maxSize > 0) {
              percentUsedValue = parseInt((item.size / item.maxSize) * 100);
            }

            return [
            // `${item.id}:`, '2K', 4, 0, '100%', 0, 'Read/Write', `${item.name}`
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
          '', 'Mounted disks:', table, '', 'Volumes available:'
        ];
        items.forEach((item) => {
          messages.push(`${item.name}: [Mounted]`);
        });
        messages.push('');
        options.message(messages);
      }
    },
    {
      name: [
        'list', 'ls'
      ],
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
      async action ({ path, dirSize }, options) {
        let item = fileSystem.currentItem;
        if (path) {
          item = await fileSystem.get(path);
        }
        const items = Array.from((await item.getItems()).values());

        const table = new ConsoleTable();
        table.addColumn({
          value: 'Name',
          align: 'left',
          minWidth: 13
        });
        table.addColumn({
          value: 'Size',
          align: 'right',
          minWidth: 8
        });
        table.addColumn({
          value: 'Access',
          align: 'center',
          minWidth: 12
        });
        table.addColumn({
          value: 'Date / Time',
          align: 'center',
          minWidth: 18
        });
        table.addRow(
          items.reduce((result, item) => {
            let size;
            if (item instanceof ItemContainer && !dirSize) {
              size = 'DIR';
            } else {
              size = fillString(stripByteString(item.size), 8, true, '0');
            }
            const access = item.isLocked() ? 'Read' : 'Read/Write';
            result.push([
            `${item.id}:`, size, access, item.createdDate ? formatDate('D-mm-y H:I:S', item.createdDate) : ''
            ]);
            return result;
          }, [])
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
};
