import { reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import { ArgumentInfo } from '../../Command';
import errorMessage from '../../../services/errorMessage';
import Window from '../../Window';
import WbEnvAtomStorageBar from '../../../components/atoms/StorageBar';
import WbEnvSymbolWrapper from '../../../components/SymbolWrapper';
import DialogContent from '../../../components/molecules/DialogContent';

export default ({ module, core }) => {
  const { files, windows, symbols } = core.modules;
  const fileSystem = files.fs;
  return [
    {
      name: ['openDirectory', 'openDir'],
      description: 'Opens the specified directory.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the directory.'
        }),
        new ArgumentInfo({
          name: 'sortSymbols',
          description: 'Sort Symbols',
          flag: true
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
          name: 'windowScale',
          description: 'Window Scale'
        }),
        new ArgumentInfo({
          name: 'windowScrollX',
          description: 'Window Scroll-X'
        }),
        new ArgumentInfo({
          name: 'windowScrollY',
          description: 'Window Scroll-Y'
        }),
        new ArgumentInfo({
          name: 'windowSidebar',
          description: 'Window Sidebar'
        }),
        new ArgumentInfo({
          name: 'windowFullSize',
          description: 'Window Full-Size'
        })
      ],

      async action({
        path,
        sortSymbols,
        windowSize,
        windowPosition,
        windowScale,
        windowScrollX,
        windowScrollY,
        windowSidebar,
        windowFullSize
      }) {
        if (!path) {
          throw errorMessage.get('bad_args');
        }
        const item = await fileSystem.get(path);
        const fsWrapperId = await symbols.addFileSystemWrapper(item);
        const symbolWrapper = symbols.symbolWrappers.get(fsWrapperId);

        const sidebarComponentData = reactive({
          value: item.size / item.maxSize
        });

        const openDirectoryWindow = windows.addWindow(
          {
            title: item.name,
            layout: {
              size: ipoint(
                ...(windowSize || '400,200')
                  .split(',')
                  .map(value => Number(value))
              ),
              position: ipoint(
                ...(windowPosition || '0,0')
                  .split(',')
                  .map(value => Number(value))
              )
            },
            symbolWrapper,
            sidebarComponent: WbEnvAtomStorageBar,
            sidebarComponentData,
            component: WbEnvSymbolWrapper,
            componentData: {
              wrapper: symbolWrapper,
              parentScrollable: windowScrollX || windowScrollY
            },
            options: {
              sidebar: windowSidebar !== undefined ? windowSidebar : true,
              scale: windowScale !== undefined ? windowScale : true,
              scrollX: windowScrollX !== undefined ? windowScrollX : true,
              scrollY: windowScrollY !== undefined ? windowScrollY : true,
              center: !windowPosition
            }
          },
          {
            active: true,
            full: windowFullSize
          }
        );

        const refreshStorageValue = () => {
          sidebarComponentData.value = item.size / item.maxSize;
        };

        const subscriptions = [
          symbolWrapper.events.subscribe(refreshStorageValue)
        ];

        return new Promise(resolve => {
          openDirectoryWindow.events.subscribe(({ name }) => {
            if (name === 'ready' && sortSymbols) {
              window.requestAnimationFrame(() => {
                symbolWrapper.rearrangeIcons();
              });
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
      name: ['openDialog'],
      description: 'Open a Dialog.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: ['message'],
          description: 'Message from Dialog.'
        }),
        new ArgumentInfo({
          index: 1,
          name: ['title'],
          description: 'Title from Dialog.'
        }),
        new ArgumentInfo({
          name: ['apply'],
          description: 'Title from apply button.'
        }),
        new ArgumentInfo({
          name: ['abort'],
          description: 'Title from abort button.'
        }),
        new ArgumentInfo({
          name: ['confirm'],
          flag: true,
          description: 'Defines the confirm dialog'
        }),
        new ArgumentInfo({
          name: ['prompt'],
          flag: true,
          description: 'Defines the prompt dialog'
        }),
        new ArgumentInfo({
          name: ['promptType'],
          description:
            'Type from prompt dialog (e.g. text, number, email). (Default: text)'
        }),
        new ArgumentInfo({
          name: ['promptStep'],
          description:
            'Step from prompt dialog (e.g. 1, 0.1, 0.01). (Default: 1)'
        }),

        new ArgumentInfo({
          name: ['promptValue'],
          description: 'Default value from prompt dialog.'
        }),
        new ArgumentInfo({
          name: ['secret'],
          flag: false,
          description: 'Input is illegible.'
        })
      ],
      // eslint-disable-next-line complexity
      action: data => {
        const {
          title = null,
          message = null,
          apply = null,
          abort = null,
          confirm = false,
          prompt = false,
          promptType = 'text',
          promptStep = undefined,
          promptValue = null,
          secret = false
        } = data;

        // if (!message) {
        //   throw new Error('Message is emoty!');
        // }

        let resolver;
        const applyCb = value => {
          resolver(value);
        };
        const abortCb = () => {
          resolver(false);
        };

        const window = module.addWindow(
          new Window({
            title,
            component: DialogContent,
            componentData: {
              title,
              message,
              secret,
              confirm,
              prompt,
              promptType,
              promptStep: Number(promptStep),
              promptValue,
              applyLabel: apply || 'Continue',
              abortLabel: abort,
              apply: applyCb,
              abort: abortCb
            },
            options: {
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false,
              close: false
            }
          })
        );

        window.awaitClose().then(() => abortCb());

        return new Promise(resolve => {
          resolver = resolve;
        }).then(value => {
          window.close();
          return value;
        });
      }
    }
  ];
};
