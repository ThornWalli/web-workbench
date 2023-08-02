
import { getItemId } from '../../../../utils/fileSystem';
import errorMessage from '../../../../services/errorMessage';
import { atob } from '../../../../utils/helper';
import ItemDirectory from '../../../FileSystem/items/Directory';
import { ArgumentInfo } from '../../../Command';

export default ({ module }) => {
  const { fileSystem } = module;
  const core = module.core;

  return [
    {
      name: [
        'mountDisk'
      ],
      description: 'Mount Disk',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'id',
          description: 'Disk ID'
        })
      ],
      async action ({ id }, options) {
        const executionResolve = core.addExecution();
        const { getDisk } = await await import('@web-workbench/disks');
        // const disk = await import(`@web-workbench/disks/${id}/index.js`).then(module => module.default);
        const disk = await getDisk(id);
        const item = await fileSystem.addFloppyDisk(disk({ core }));
        options.message(`Mount Disk <strong>${item.name}</strong> <strong>(${item.id})</strong> successful!`);
        executionResolve();
      }
    },
    {
      name: [
        'changeDirectory', 'cd'
      ],
      description: 'cd %path%',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Directory path'
        })
      ],
      async action ({ path }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        try {
          await fileSystem.changeDirectory(path);
        } catch (error) {
          throw errorMessage.get('cant_find', path);
        }
      }
    },
    {
      name: [
        'exist'
      ],
      description: 'Check if file exists.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        })
      ],
      async action ({ path }, options) {
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
      name: [
        'makedir', 'mkdir'
      ],
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
      async action ({ path, name, ignore }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.makedir(path, name || getItemId(path), { ignore });
        options.message(`Directory "${item.name}" created`);
        return item;
      }
    },
    {
      name: [
        'remove', 'rm'
      ],
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        }),
        new ArgumentInfo({
          name: [
            'recursive', 'r'
          ],
          flag: true,
          description: 'Remove Directory Items and Directories.'
        }),
        new ArgumentInfo({
          name: [
            'ignore'
          ],
          flag: true,
          description: 'Ignore the specified file is deleted.'
        })
      ],
      async  action ({ path, recursive, ignore }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const items = await fileSystem.remove(path, recursive, { ignore });
        return [].concat(items).map((item) => {
          const type = item.type === ItemDirectory.NAME ? 'Directory' : 'File';
          options.message(`Removed ${type}: ${item.name}`);
          return item;
        });
      }
    },
    {
      name: [
        'readfile', 'getfile'
      ],
      description: 'Get file content',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Filename'
        })
      ],
      async action ({ path }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        return item.data;
      }
    },
    {
      name: [
        'makefile', 'mkfile'
      ],
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
      async action ({ path, name, data, override = false, encode }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }

        if (typeof data === 'string') {
          data = await atob(data);
        }

        const item = await fileSystem.makefile(path, name, data, { override });
        options.message(`File "${item.name}" created`);
        return item;
      }
    },
    {
      name: [
        'editfile'
      ],
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
      async action ({ path, data }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }

        if (typeof data === 'string') {
          data = await atob(data);
        }

        const item = await fileSystem.editfile(path, data);
        options.message(`File "${item.name}" edited`);
        return item;
      }
    },
    {
      name: [
        'editfilemeta'
      ],
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
        })
      ],
      async action ({ path, name, value }, options) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        // try {
        //   value = JSON.parse(value);
        // } catch (error) {
        //   throw new Error('Invalid Value');
        // }

        const item = await fileSystem.editfileMeta(path, name, value);
        options.message(`File  "${item.name}" Meta edited`);
        return item;
      }
    },
    {
      name: [
        'makelink', 'mklink'
      ],
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
      async action ({ ref, name, dest }, options) {
        if (!ref) {
          throw errorMessage.get('bad_args');
        }
        dest = dest || '.';

        const refItem = await fileSystem.get(ref);
        const item = await fileSystem.makelink(refItem, name);

        const destItem = await fileSystem.get(dest);
        if (destItem !== fileSystem.currentItem) {
          await fileSystem.move(item, dest, {
            ignore: true
          });
        }
        options.message(`Created link "${name}" with "${await refItem.getPath()}"`);
        return item;
      }
    },
    {
      name: [
        'editlink'
      ],
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
      async action ({ path, ref }, options) {
        if (!(path && ref)) {
          throw errorMessage.get('bad_args');
        }
        const refItem = await fileSystem.get(ref);
        const item = await fileSystem.editlink(path, refItem);
        options.message(`Edited link "${name}" with "${await refItem.getPath()}"`);
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
          name: [
            'name', 'n'
          ],
          flag: true,
          description: 'When set, changes the display name.'
        }),
        new ArgumentInfo({
          name: [
            'removeName', 'rn'
          ],
          flag: true,
          description: 'When set, removes the display name.'
        })
      ],
      async action ({ path, value, name, removeName }, options) {
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
      name: [
        'cp', 'copy'
      ],
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
          name: [
            'ignore', 'i'
          ],
          flag: true,
          description: 'When sets, creates a new file if exists.'
        })
      ],
      async action ({ from, dest, ignore }, options) {
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
      name: [
        'mv', 'move'
      ],
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
      async action ({ from, to, itemPosition }, options) {
        if (!to || !from) {
          throw errorMessage.get('bad_args');
        }
        const meta = new Map();
        if (itemPosition) {
          meta.set(
            'itemPosition',
            [
              0, 0
            ].map((position, i) => {
              const positionSplit = itemPosition.split(',');
              return parseInt(positionSplit[Number(i)] || 0);
            })
          );
        }
        const item = await fileSystem.move(from, to, { meta });
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
      name: [
        'executeFile'
      ],
      description: 'Execute file.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the file'
        })
      ],
      async action ({ path }, options) {
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
};

errorMessage.add('cant_find_action', 'Can\'t find action %1');
