import { reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import { ArgumentInfo, defineCommands } from '../../Command';
import errorMessage from '../../../services/errorMessage';
import Window from '../../Window';

import WbEnvAtomStorageBar from '../../../components/atoms/StorageBar.vue';
import WbEnvSymbolWrapper from '../../../components/SymbolWrapper.vue';
import DialogContent from '../../../components/molecules/DialogContent.vue';
import type Windows from '.';
import type Core from '../../Core';
import ItemContainer from '../../FileSystem/ItemContainer';

export default defineCommands<{ module: Windows; core: Core }>(
  ({ module, core }) => {
    // const { files, windows, symbols } = core.modules;
    const fileSystem = core.modules.files?.fs;
    const symbols = core.modules.symbols;
    const windows = core.modules.windows;

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

        // eslint-disable-next-line complexity
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
        }: {
          path: string;
          sortSymbols?: boolean;
          windowSize?: string;
          windowPosition?: string;
          windowScale?: boolean;
          windowScrollX?: boolean;
          windowScrollY?: boolean;
          windowSidebar?: boolean;
          windowFullSize?: boolean;
        }) {
          if (!path) {
            throw errorMessage.get('bad_args');
          }
          const item = await fileSystem?.get(path);

          if (!item) {
            throw errorMessage.get('FileSystemItem_itemNotFound', path);
          }

          if (!(item instanceof ItemContainer)) {
            throw errorMessage.get('FileSystemItem_itemNotContainer', path);
          }

          const fsWrapperId = await symbols?.addFileSystemWrapper(item);
          const symbolWrapper = symbols?.symbolWrappers.get(
            fsWrapperId as string
          );

          const sidebarComponentData = reactive({
            value: item.size / item.maxSize
          });

          const getPointFromString = (value: string) => {
            const [x, y] = value.split(',');
            return ipoint(Number(x), Number(y));
          };

          const openDirectoryWindow = windows?.addWindow(
            {
              title: item.name,
              layout: {
                size: getPointFromString(windowSize || '400,200'),
                position: getPointFromString(windowPosition || '0,0')
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
            symbolWrapper?.events.subscribe(refreshStorageValue)
          ];

          return new Promise(resolve => {
            openDirectoryWindow?.events.subscribe(({ name }) => {
              if (name === 'ready' && sortSymbols) {
                window.requestAnimationFrame(() => {
                  symbolWrapper?.rearrangeIcons();
                });
              } else if (name === 'close') {
                subscriptions.forEach(subscribe => subscribe?.unsubscribe());
                if (fsWrapperId) {
                  symbols?.removeWrapper(fsWrapperId);
                }
                resolve(true);
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

        action: (data: {
          title: string;
          message?: string | null;
          apply?: string | null;
          abort?: string | null;
          confirm?: boolean;
          prompt?: boolean;
          promptType?: string;
          promptStep?: number | undefined;
          promptValue?: string | null;
          secret?: boolean;
        }) => {
          const {
            title,
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

          let resolver: CallableFunction;
          const applyCb = (value: unknown | boolean) => {
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
  }
);
