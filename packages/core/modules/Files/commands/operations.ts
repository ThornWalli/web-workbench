import { getItemId } from '../../../utils/fileSystem';
import errorMessage from '../../../services/errorMessage';
import { atob, unwrapString } from '../../../utils/helper';
import ItemDirectory from '../../../classes/FileSystem/items/Directory';
import { ArgumentInfo, defineCommands } from '../../../classes/Command';
import type Files from '..';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { openItemEdit } from '../edit';
import type Core from '@web-workbench/core/classes/Core';

export default defineCommands<{ module: Files }>(({ module }) => {
  const { fileSystem, core, disks } = module;

  return [
    {
      name: ['mountDisk'],
      description: 'Mount Disk',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'id',
          description: 'Disk ID'
        })
      ],

      async action({ id }: { id: string }, options) {
        const executionResolve = core.addExecution();
        try {
          const disk = await disks[id].data();
          const item = await fileSystem.addFloppyDisk(() => disk({ core }));
          if (!disks[id].hidden) {
            options.message(
              `Mount Disk <strong>${item.name}</strong> <strong>(${item.id})</strong> successful!`
            );
          }
          executionResolve();
        } catch (error) {
          console.error(error);
          throw errorMessage.get('cant_find_disk', id);
        }
      }
    },
    {
      name: ['changeDirectory', 'cd'],
      description: 'cd %path%',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Directory path'
        })
      ],
      async action({ path }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        try {
          await fileSystem.changeDirectory(path);
        } catch (error) {
          console.error(error);
          throw errorMessage.get('cant_find', path);
        }
      }
    },
    {
      name: ['exist'],
      description: 'Check if file exists.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        })
      ],
      async action({ path }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const id = getItemId(path);
        const exist = await fileSystem.exist(path);
        if (exist) {
          options.message(`File ${id} exists`);
        } else {
          options.message(`File ${id} does not exist`);
        }
        return exist;
      }
    },

    {
      name: ['makedir', 'mkdir'],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'name',
          description: 'Name'
        }),
        new ArgumentInfo({
          name: 'ignore',
          flag: true,
          description: 'Ignore file exist.'
        })
      ],
      async action(
        {
          path,
          name,
          ignore
        }: {
          path: string;
          name: string;
          ignore?: boolean;
        },
        options
      ) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.makedir(path, name || getItemId(path), {
          override: ignore
        });
        options.message(`Directory "${item.name}" created`);
        return item;
      }
    },
    {
      name: ['remove', 'rm'],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          name: ['recursive', 'r'],
          flag: true,
          description: 'Remove Directory Items and Directories.'
        }),
        new ArgumentInfo({
          name: ['ignore'],
          flag: true,
          description: 'Ignore the specified file is deleted.'
        })
      ],
      async action({ path, recursive, ignore }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const items = await fileSystem.remove(path, recursive, { ignore });
        return (items || []).map(item => {
          const type = item.type === ItemDirectory.TYPE ? 'Directory' : 'File';
          options.message(`Removed ${type}: ${item.name}`);
          return item;
        });
      }
    },
    {
      name: ['readfile', 'getfile'],
      description: 'Get file content',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        })
      ],
      async action({ path }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        return item.data;
      }
    },
    {
      name: ['makefile', 'mkfile'],
      description: 'Creates a file with the specified attributes.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'name',
          description: 'Name'
        }),
        new ArgumentInfo({
          index: 3,
          name: 'data',
          description: 'Data'
        }),
        new ArgumentInfo({
          name: 'override',
          flag: true,
          description: 'Deletes existing file and recreates.'
        })
      ],
      action: async (
        options: {
          path: string;
          name: string;
          data: string;
          override?: boolean;
        },
        actionOptions
      ) => {
        const item = await makeFile(core, options);

        actionOptions.message(`File "${item.name}" created`);
        return item;
      }
    },
    {
      name: ['editfile'],
      description: 'Edits file with specified attributes.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'data',
          description: 'Data'
        })
      ],
      action: async (
        options: {
          path: string;
          data: string;
        },
        actionOptions
      ) => {
        const item = await editfile(core, options);
        actionOptions.message(`File "${item.name}" edited`);
        return item;
      }
    },
    {
      name: ['openEditFileDialog'],
      description: 'Opens a file dialog to edit the file.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        })
      ],
      async action({ path }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        return openItemEdit(core, [item]);
      }
    },
    {
      name: ['editfilemeta'],
      description: 'Edits file with specified attributes.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'name',
          description: 'Name'
        }),
        new ArgumentInfo({
          index: 2,
          name: 'value',
          description: 'Value'
        }),
        new ArgumentInfo({
          index: 3,
          name: 'json',
          description: 'Is JSON value?',
          flag: true
        })
      ],
      async action({ path, name, value, json }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        if (json) {
          value = JSON.parse(decodeURIComponent(unwrapString(value)));
        }

        const item = await fileSystem.editFileMeta(path, name, value);
        options.message(`File  "${item.name}" Meta edited`);
        return item;
      }
    },
    {
      name: ['cleanfilemeta'],
      description: 'Removes all undefined meta values from the file.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          name: 'force',
          flag: true,
          description: 'When set, forces the cleaning of meta values.'
        })
      ],
      async action({ path, force }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.cleanFileMeta(path, { force });
        options.message(`File  "${item.name}" Meta cleaned`);
        return item;
      }
    },
    {
      name: ['makelink', 'mklink'],
      description: 'Creates a link to the specified path.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'ref',
          description: 'Reference path with id (example.ext).'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'name',
          description: 'Displayed Name'
        }),
        new ArgumentInfo({
          index: 2,
          name: 'dest',
          description: 'Destination directory.'
        })
      ],
      async action({ ref, name, dest }, options) {
        if (!ref) {
          throw errorMessage.get('bad_args');
        }

        dest = dest || '.';

        const refItem = await fileSystem.get(ref);
        const item = await fileSystem.makelink(refItem, name);

        const destItem = await fileSystem.get(dest);
        if (destItem !== fileSystem.currentItem) {
          await fileSystem.move(item, dest, {
            override: true
          });
        }
        options.message(
          `Created link "${name}" with "${await refItem.getPath()}"`
        );
        return item;
      }
    },
    {
      name: ['editlink'],
      description: '',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Reference filepath with id (example.ext).'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'ref',
          description: 'Destination directory.'
        })
      ],
      async action({ path, ref }, options) {
        if (!(path && ref)) {
          throw errorMessage.get('bad_args');
        }
        const refItem = await fileSystem.get(ref);
        const item = await fileSystem.editlink(path, refItem);
        options.message(
          `Edited link "${name}" with "${await refItem.getPath()}"`
        );
        return item;
      }
    },
    {
      name: 'rename',
      description: 'Renamed a file',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filepath with id (example.ext).'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'value',
          description: 'Value for id or displayed name.'
        }),
        new ArgumentInfo({
          name: ['name', 'n'],
          flag: true,
          description: 'When set, changes the display name.'
        }),
        new ArgumentInfo({
          name: ['removeName', 'rn'],
          flag: true,
          description: 'When set, removes the display name.'
        })
      ],
      async action({ path, value, name, removeName }, options) {
        if (!removeName && (!path || !value)) {
          throw errorMessage.get('bad_args');
        }

        const item = await fileSystem.get(path);
        const lastValue = name ? item.name : item.id;

        await fileSystem.rename(path, value, {
          name,
          removeName
        });
        options.message(`Renamed from "${lastValue}" to "${value}"`);
        return item;
      }
    },
    {
      name: ['cp', 'copy'],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'from',
          description: 'Source Filepath with id (example.ext).'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'dest',
          description: 'Destination Filepath with id (example.ext).'
        }),
        new ArgumentInfo({
          name: ['ignore', 'i'],
          flag: true,
          description: 'When sets, creates a new file if exists.'
        })
      ],
      async action({ from, dest, ignore }, options) {
        let to = dest;
        if (!to && ignore) {
          to = from;
        }
        if (!to || !from) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.copy(from, to, { ignore });
        options.message(`Copied from "${from}" to "${to}"`);
        return item;
      }
    },
    {
      name: ['mv', 'move'],
      description: 'move %from% %to%',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'from',
          description: 'From path'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'to',
          description: 'To path'
        }),
        new ArgumentInfo({
          index: 2,
          name: 'item-position',
          description: 'Sets the position in the Icon view. (x,y)'
        })
      ],
      async action(
        {
          from,
          to,
          itemPosition
        }: {
          from: string;
          to: string;
          itemPosition?: string;
        },
        options
      ) {
        if (!to || !from) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.move(from, to);
        if (itemPosition) {
          item.meta.set(
            ITEM_META.POSITION,
            [0, 0].map((position, i) => {
              const positionSplit = itemPosition.split(',');
              return parseInt(positionSplit[Number(i)] || '0');
            })
          );
        }
        item.save();
        let type;
        if (item instanceof ItemDirectory) {
          type = 'Directory';
        } else {
          type = 'File';
        }
        options.message(`${type} moved ${item.name}`);
        return item;
      }
    },
    {
      name: ['executeFile'],
      description: 'Execute file.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the file'
        })
      ],
      async action({ path }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        if (typeof item.action === 'function') {
          return item.action(core);
        } else {
          throw errorMessage.get('cant_find_action', path);
        }
      }
    }
    // {
    //   name: [
    //     'execute'
    //   ],
    //   description: 'Executes the specified file, first argument is the path, all further arguments are passed to the file.',
    //   args: [
    //     new ArgumentInfo({
    //       index: 0,
    //       name: 'path',
    //       description: 'Path to the file'
    //     }),
    //     new ArgumentInfo({
    //       index: 1,
    //       name: 'base64',
    //       flag: true,
    //       description: 'If set, a base64 string can be used with the first argument.'
    //     })
    //   ],
    //   action (params, options) {
    //     options.message('Hier fehlt code…');
    //     return Promise.resolve();
    //   }
    // }
  ];
});

errorMessage.add('cant_find_action', "Can't find action %1");
errorMessage.add('cant_find_disk', "Can't find disk %1");

export async function makeFile(
  core: Core,
  {
    path,
    name,
    data,
    override = false
  }: {
    path: string;
    name?: string;
    data: string;
    override?: boolean;
  }
) {
  if (!path) {
    throw errorMessage.get('bad_args');
  }

  if (typeof data === 'string') {
    data = atob(data);
  }

  const item = await core.modules.files!.fs.makeFile(path, name, data, {
    override: override || false,
    meta: []
  });
  return item;
}

export function editfile(
  core: Core,
  {
    path,
    data
  }: {
    path: string;
    data: string;
  }
) {
  if (!path) {
    throw errorMessage.get('bad_args');
  }

  if (typeof data === 'string') {
    data = atob(data);
  }

  return core.modules.files!.fs.editFile(path, data);
}
