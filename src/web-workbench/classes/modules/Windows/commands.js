import { ipoint } from '@js-basics/vector';
import { ArgumentInfo } from '../../Command';
import errorMessage from '../../../services/errorMessage';
import Window from '../../Window';
import WbEnvAtomStorageBar from '../../../../components/environments/atoms/StorageBar';
import WbEnvSymbolWrapper from '../../../../components/environments/SymbolWrapper';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from './index';
import DialogContent from '@/components/environments/molecules/DialogContent';

export default ({ module, core }) => {
  const { files, windows, symbols } = core.modules;
  const fileSystem = files.fs;
  return [
    {
      name: [
        'openDirectory', 'openDir'
      ],
      description: 'Opens the specified directory.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the directory.'
        }),
        new ArgumentInfo({
          name: 'windowSize',
          description: 'Window Size'
        }),
        new ArgumentInfo({
          name: 'windowPosition',
          description: 'Window Position'
        }),
        new ArgumentInfo({
          name: 'sortSymbols',
          description: 'Sort Symbols',
          flag: true
        })
      ],
      async action ({ path, windowSize, windowPosition, sortSymbols }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        const fsWrapperId = await symbols.addFileSystemWrapper(item);
        const symbolWrapper = symbols.symbolWrappers.get(fsWrapperId);

        const sidebarComponentData = {
          value: item.size / item.maxSize,
          visible: core.config.observable[WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE]
        };

        const window = windows.addWindow({
          title: item.name,
          layout: { size: ipoint(...(windowSize || '400,200').split(',')), position: ipoint(...(windowPosition || '0,0').split(',')) },
          symbolWrapper,
          sidebarComponent: WbEnvAtomStorageBar,
          sidebarComponentData,
          component: WbEnvSymbolWrapper,
          componentData: {
            wrapper: symbolWrapper
          }
        }, { active: true });

        const refreshStorageValue = () => {
          sidebarComponentData.value = item.size / item.maxSize;
        };

        const subscriptions = [
          symbolWrapper.events.subscribe(refreshStorageValue)
        ];

        return new Promise((resolve) => {
          window.events.subscribe(({ name }) => {
            if (name === 'ready' && sortSymbols) {
              symbolWrapper.rearrangeIcons();
            } else if (name === 'close') {
              subscriptions.forEach(subscribe => subscribe.unsubscribe());
              symbols.removeWrapper(fsWrapperId);
              resolve();
            } else {
              refreshStorageValue();
            }
          });
        });
      }
    },
    {
      name: [
        'openDialog'
      ],
      description: 'Open a Dialog.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: [
            'message'
          ],
          description: 'Message from Dialog.'
        }),
        new ArgumentInfo({
          index: 1,
          name: [
            'title'
          ],
          description: 'Title from Dialog.'
        }),
        new ArgumentInfo({
          name: [
            'apply'
          ],
          description: 'Title from apply button.'
        }),
        new ArgumentInfo({
          name: [
            'abort'
          ],
          description: 'Title from abort button.'
        }),
        new ArgumentInfo({
          name: [
            'confirm'
          ],
          flag: true,
          description: 'Defines the confirm dialog'
        }),
        new ArgumentInfo({
          name: [
            'prompt'
          ],
          flag: true,
          description: 'Defines the prompt dialog'
        }),
        new ArgumentInfo({
          name: [
            'secret'
          ],
          flag: false,
          description: 'Input is illegible.'
        })
      ],
      action: ({
        title = null,
        message = null,
        apply = null,
        abort = null,
        confirm = false,
        prompt = false,
        secret = false
      }, options) => {
        // if (!message) {
        //   throw new Error('Message is emoty!');
        // }

        let resolver;
        const applyCb = (value) => { resolver(value); };
        const abortCb = () => { resolver(false); };
        const window = module.addWindow(new Window({
          title,
          component: DialogContent,
          componentData: {
            title,
            message,
            secret,
            confirm,
            prompt,
            applyLabel: apply || 'Continue',
            abortLabel: abort,
            apply: applyCb,
            abort: abortCb
          },
          options: {
            scale: false,
            scrollX: false,
            scrollY: false,
            close: false
          }
        }));
        window.events.subscribe(({ name }) => {
          if (name === 'close') {
            abortCb();
          }
        });

        return new Promise((resolve) => {
          resolver = resolve;
        }).then((value) => {
          window.close();
          return value;
        });
      }
    }

    //     new Command({
    //       name: ['openDirectory', 'openDir'],
    //       description: 'Opens the specified directory.',
    //       args: [
    //         new ArgumentInfo({
    //           name: ['arg0', '--path'],
    //           description: 'Path to the directory.'
    //         })
    //       ].concat(windowArgs),
    //       callback: (data, options) => {
    //         const path = data.args[0] || data.kwargs.path;
    //         return fileSystem.get(path).then(item => {
    //           const sorticons = data.kwargs.sorticons || item.info.has('windowSortIcons');

    //           data.kwargs.windowPosition = data.kwargs.windowPosition || item.info.get('windowPosition');
    //           data.kwargs.windowDimension = data.kwargs.windowDimension || item.info.get('windowDimension');

    //           data.kwargs.sorticons = sorticons;

    //           data.kwargs.title = data.kwargs.title || item.displayName;
    //           data.kwargs.scale = data.kwargs.scale !== undefined ? data.kwargs.scale : true;
    //           data.kwargs.scroll = data.kwargs.scroll !== undefined ? data.kwargs.scroll : true;
    //           data.kwargs.center = data.kwargs.center !== undefined ? data.kwargs.center : true;

    //           // Set Component
    //           data.args[0] = 'Directory';
    //           return openView(data).then(result => result.value).then(viewModel => {
    //             // Set fileSystemItem to itemControl from open directory view.
    //             return Promise.resolve(item)
    //               .then(fileSystem.childrens)
    //               .then(async items => {
    //                 return viewModel.getAsync('itemControl').then(itemControl => {
    //                   return new Promise(resolve => {
    //                     itemControl.$once('ItemControl:fileSystemItemsReady', resolve);
    //                     itemControl.fileSystemItem = item;
    //                   }).then(() => {
    //                     // return itemControl.items.add(
    //                     //   Array.from(items.values()).reduce((result, item) => {
    //                     //     result.push({
    //                     //       id: item.id,
    //                     //       fileSystemItem: item
    //                     //     });
    //                     //     return result;
    //                     //   }, [])
    //                     if (sorticons) {
    //                       itemControl.rearrangeIcons();
    //                     }
    //                     viewModel.hasStorage = true;

    //                     return new CLIResult({
    //                       command: data.origin,
    //                       message: lang.parse('${lang.enviroments.viewControl.commands.window.open}', {
    //                         id: `<strong>${viewModel.id}</strong>`
    //                       }),
    //                       value: viewModel,
    //                       showCommand: false,
    //                       showResult: false,
    //                       ready: true
    //                     });
    //                   });
    //                 });
    //               })
    //               .catch(e => {
    //                 return e;
    //               })
    //               .then(item => {
    //                 if (options.message) {
    //                   return `Directory <strong>${path}</strong> opened`;
    //                 } else {
    //                   return item;
    //                 }
    //               });
    //           });
    //         });
    //       }
    //     }),

  ];
};
// import Command from '@/js/base/commandLineInterface/Command';
// import ArgumentInfo from '@/js/base/commandLineInterface/ArgumentInfo';
// import runtimeConfig from '@/js/services/runtimeConfig';
// import applications from '@/js/services/applications';
// import fileSystem from '@/js/services/fileSystem';
// import FileSystemItem from '@/js/base/fileSystem/Item';
// import { Value } from '@/js/base/Value';
// import lang from '@/js/services/lang';

// import { Result as CLIResult } from '@/js/base/CommandLineInterface';

// import { Table as ConsoleTable } from '@/js/utils/console';

// export function openView (data) {
//   const path = data.args[0] || data.kwargs.path;
//   const viewControl = applications.getByName('view-control');
//   return viewControl.getViewComponent(path).then(component => {
//     return viewControl.openView(component, {
//       static: data.kwargs.static,
//       id: data.kwargs.id,
//       title: data.args[1] || data.kwargs.title,
//       scale: data.kwargs.scale,
//       scaleX: data.kwargs.scaleX,
//       scaleY: data.kwargs.scaleY,
//       scroll: data.kwargs.scroll,
//       scrollX: data.kwargs.scrollX,
//       scrollY: data.kwargs.scrollY,
//       fullwindow: data.kwargs.fullwindow || false,
//       fullscreen: data.kwargs.fullscreen || false,
//       width: data.kwargs.width,
//       height: data.kwargs.height,
//       center: data.kwargs.center,
//       windowPosition: data.kwargs.windowPosition,
//       windowDimension: data.kwargs.windowDimension
//     })
//       .then(view => {
//         return new CLIResult({
//           command: data.origin,
//           message: lang.parse('${lang.enviroments.viewControl.commands.window.open}', {
//             id: `<strong>${view.id}</strong>`
//           }),
//           value: view,
//           showCommand: false,
//           showResult: false,
//           ready: true
//         });
//       });
//   });
// }

// const windowArgs = [
//   new ArgumentInfo({
//     name: ['--static'],
//     description: 'Window static.'
//   }),
//   new ArgumentInfo({
//     name: ['--id'],
//     description: 'Window Id.'
//   }),
//   new ArgumentInfo({
//     name: ['--scale'],
//     description: 'Window scalable.'
//   }),
//   new ArgumentInfo({
//     name: ['--scaleX'],
//     description: 'Window x axis scalable.'
//   }),
//   new ArgumentInfo({
//     name: ['--scaleY'],
//     description: 'Window y axis scalable.'
//   }),
//   new ArgumentInfo({
//     name: ['--scroll'],
//     description: 'Window scrollable.'
//   }),
//   new ArgumentInfo({
//     name: ['--scrollX'],
//     description: 'Window x axis scrollable.'
//   }),
//   new ArgumentInfo({
//     name: ['--scrollY'],
//     description: 'Window y axis scrollable.'
//   }),
//   new ArgumentInfo({
//     name: ['--fullwindow'],
//     description: 'Sets window to fullwindow.'
//   }),
//   new ArgumentInfo({
//     name: ['--fullscreen'],
//     description: 'Sets window to fullscreen.'
//   }),
//   new ArgumentInfo({
//     name: ['--center'],
//     description: 'Sets window position center.'
//   })
// ];

// export default () => {
//   return [
//     new Command({
//       name: 'windowOpen',
//       description: 'Opens a window with the specified path',
//       args: [
//         new ArgumentInfo({
//           name: ['arg0', '--path'],
//           description: 'Path to open in the window'
//         }),
//         new ArgumentInfo({
//           name: ['arg1', '--title'],
//           description: 'Window Title.'
//         })
//       ].concat(windowArgs),
//       callback: data => {
//         return openView(data);
//       }
//     }),
//     new Command({
//       name: 'windowclose',
//       description: 'Close a window with the id.',
//       args: [
//         new ArgumentInfo({
//           name: ['arg0', '--id'],
//           description: 'Window Id.'
//         })
//       ],
//       callback: (data, options) => {
//         return options.cli.run('window close ' + (data.args[0] || data.kwargs.id));
//       }
//     }),

//     new Command({
//       name: 'dialogOpen',
//       description: 'Open a Dialog.',
//       args: [
//         new ArgumentInfo({
//           name: ['arg0', '--title'],
//           description: 'Title from Dialog.'
//         }),
//         new ArgumentInfo({
//           name: ['arg1', '--message'],
//           description: 'Message from Dialog.'
//         }),
//         new ArgumentInfo({
//           name: ['--apply'],
//           description: 'Title from apply button.'
//         }),
//         new ArgumentInfo({
//           name: ['--abort'],
//           description: 'Title from abort button.'
//         }),
//         new ArgumentInfo({
//           name: ['-prompt'],
//           description: 'Defines the prompt dialog'
//         }),
//         new ArgumentInfo({
//           name: ['-confirm'],
//           description: 'Defines the confirm dialog.'
//         }),
//         new ArgumentInfo({
//           name: ['-password'],
//           description: 'Input is illegible.'
//         })
//       ],
//       callback: (data, options) => {
//         debugger;
//         return applications
//           .getByName('view-control')
//           .openDialog({
//             title: data.args[0] || data.kwargs.title,
//             message: data.args[1] || data.kwargs.message,
//             buttons: [data.kwargs.apply || 'Continue', data.kwargs.abort || 'Cancel'],
//             prompt: data.kwargs.prompt || false,
//             password: data.kwargs.password || false
//           })
//           .then(view => {
//             view.visible = true;
//             return view.getAsync('application').then(dialog => {
//               options.loadingCallback();
//               return dialog.promise;
//             });
//           });
//       }
//     }),

//     new Command({
//       name: ['openPreview'],
//       description: 'Opens a preview view of the specified file.',
//       args: [
//         new ArgumentInfo({
//           name: ['arg0', '--path'],
//           description: 'Path to the file'
//         }),
//         new ArgumentInfo({
//           name: ['-base64']
//         })
//       ].concat(windowArgs),
//       callback (data) {
//         const path = data.args[0] || data.kwargs.path;
//         if (!path) {
//           throw lang.parse('${lang.commands.badArgs}');
//         }
//         let result;
//         if (data.kwargs.base64) {
//           result = Promise.resolve();
//         } else {
//           result = fileSystem.get(data.args[0]);
//         }
//         return result
//           .then(item => {
//             data.kwargs.windowPosition = data.kwargs.windowPosition || item ? item.info.get('windowPosition') : null;
//             data.kwargs.windowDimension = data.kwargs.windowDimension || item ? item.info.get('windowDimension') : null;

//             data.kwargs.title = data.kwargs.title || (item ? `Preview ${item.displayName || item.path}` : 'Preview');
//             data.kwargs.scale = data.kwargs.scale !== undefined ? data.kwargs.scale : true;
//             data.kwargs.scroll = data.kwargs.scroll !== undefined ? data.kwargs.scroll : true;
//             data.kwargs.center = data.kwargs.center !== undefined ? data.kwargs.center : true;

//             // Set Component
//             data.args[0] = 'fileControl/Preview';
//             return openView(data).then(result => result.value).then(viewModel => {
//               if (data.kwargs.base64) {
//                 viewModel.application.setData(FileSystemItem.decodeData(path));
//               } else {
//                 viewModel.application.setData(item.data);
//               }
//               return true;
//             });
//           })
//           .catch(e => {
//             throw e;
//             // throw lang.parse('${lang.cores.file.commands.cantOpenFile}', {
//             //     path
//             // });
//           });
//       }
//     }),

//     new Command({
//       name: ['openDirectory', 'openDir'],
//       description: 'Opens the specified directory.',
//       args: [
//         new ArgumentInfo({
//           name: ['arg0', '--path'],
//           description: 'Path to the directory.'
//         })
//       ].concat(windowArgs),
//       callback: (data, options) => {
//         const path = data.args[0] || data.kwargs.path;
//         return fileSystem.get(path).then(item => {
//           const sorticons = data.kwargs.sorticons || item.info.has('windowSortIcons');

//           data.kwargs.windowPosition = data.kwargs.windowPosition || item.info.get('windowPosition');
//           data.kwargs.windowDimension = data.kwargs.windowDimension || item.info.get('windowDimension');

//           data.kwargs.sorticons = sorticons;

//           data.kwargs.title = data.kwargs.title || item.displayName;
//           data.kwargs.scale = data.kwargs.scale !== undefined ? data.kwargs.scale : true;
//           data.kwargs.scroll = data.kwargs.scroll !== undefined ? data.kwargs.scroll : true;
//           data.kwargs.center = data.kwargs.center !== undefined ? data.kwargs.center : true;

//           // Set Component
//           data.args[0] = 'Directory';
//           return openView(data).then(result => result.value).then(viewModel => {
//             // Set fileSystemItem to itemControl from open directory view.
//             return Promise.resolve(item)
//               .then(fileSystem.childrens)
//               .then(async items => {
//                 return viewModel.getAsync('itemControl').then(itemControl => {
//                   return new Promise(resolve => {
//                     itemControl.$once('ItemControl:fileSystemItemsReady', resolve);
//                     itemControl.fileSystemItem = item;
//                   }).then(() => {
//                     // return itemControl.items.add(
//                     //   Array.from(items.values()).reduce((result, item) => {
//                     //     result.push({
//                     //       id: item.id,
//                     //       fileSystemItem: item
//                     //     });
//                     //     return result;
//                     //   }, [])
//                     if (sorticons) {
//                       itemControl.rearrangeIcons();
//                     }
//                     viewModel.hasStorage = true;

//                     return new CLIResult({
//                       command: data.origin,
//                       message: lang.parse('${lang.enviroments.viewControl.commands.window.open}', {
//                         id: `<strong>${viewModel.id}</strong>`
//                       }),
//                       value: viewModel,
//                       showCommand: false,
//                       showResult: false,
//                       ready: true
//                     });
//                   });
//                 });
//               })
//               .catch(e => {
//                 return e;
//               })
//               .then(item => {
//                 if (options.message) {
//                   return `Directory <strong>${path}</strong> opened`;
//                 } else {
//                   return item;
//                 }
//               });
//           });
//         });
//       }
//     }),

//     new Command({
//       name: ['window'],
//       description: '',
//       args: [
//         new ArgumentInfo({
//           name: ['list', 'ls'],
//           description: 'List all windows.'
//         }),
//         new ArgumentInfo({
//           name: ['close'],
//           description: 'Close window by id. (window close id)'
//         })
//       ],
//       callback (data) {
//         return applications.getByNameAsync('view-control').then(viewControl => {
//           console.log('ViewControl', data);
//           if (data.args[0] === 'list' || data.args[0] === 'ls') {
//             const table = new ConsoleTable();
//             table.addColumn({
//               value: 'Id',
//               align: 'left',
//               spacerWidth: 15
//             });
//             table.addColumn({
//               value: 'Title',
//               align: 'left',
//               spacerWidth: 25
//             });
//             table.addColumn({
//               value: 'Application-Name',
//               align: 'center',
//               spacerWidth: 25
//             });
//             table.addColumn({
//               value: 'Z-Index',
//               align: 'right',
//               spacerWidth: 7
//             });
//             table.addColumn({
//               value: 'Freeze',
//               align: 'right',
//               spacerWidth: 7
//             });
//             table.addColumn({
//               value: 'GLOBAL',
//               align: 'right',
//               spacerWidth: 7
//             });
//             table.addRows(
//               viewControl.views.reduce((result, view) => {
//                 var applicationTitle = '';
//                 if (view.application) {
//                   applicationTitle = view.application.applicationName;
//                 }
//                 result.push([view.id, view.title, applicationTitle, String(view.zIndex), view.freeze ? 'yes' : 'no', view.global ? 'yes' : 'no']);
//                 return result;
//               }, [])
//             );
//             return Promise.resolve(new Value(`#text\n${[table.getColumns(), table.getRows()].join('\n')}`));
//           } else if (data.args[0] === 'close') {
//             const id = data.args[1] || data.kwargs.id;
//             if (viewControl.getViewModel(id)) {
//               // Wait for process counter from Exectuor.
//               setTimeout(() => {
//                 viewControl.getViewModel(id).close();
//               }, 500);
//               return lang.parse('${lang.enviroments.viewControl.commands.window.closed}', {
//                 id: `<strong>${id}</strong>`
//               });
//             } else {
//               throw new Error(
//                 lang.parse('${lang.enviroments.viewControl.commands.window.idNotExists}', {
//                   id
//                 })
//               );
//             }
//           } else {
//             if ('REARRAGE_ICONS' in data.kwargs) {
//               return applications.getByNameAsync('view-control').then(viewControl => {
//                 console.log('viewControl.getCurrentIconControl()', viewControl.getCurrentIconControl());
//                 return viewControl.getCurrentIconControl().rearrangeIcons(runtimeConfig.get('view-control-icons-order-type'));
//               });
//             }
//           }
//         });
//       }
//     })
//   ];
// };
