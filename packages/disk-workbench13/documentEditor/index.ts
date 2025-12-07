import themeWhiteContrast from '@web-workbench/core/themes/whiteContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import { markRaw, nextTick, reactive } from 'vue';
import type { Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { getDefaultDocumentModel } from './utils';
import { CONFIG_NAMES } from './types';
import type { Model } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { SYMBOL } from '../types';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;

  return [
    {
      meta: [
        [ITEM_META.SYMBOL, SYMBOL.DOCUMENT_EDITOR],
        [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
      ],
      id: 'DocumentEditor.app',
      name: 'Document Editor',
      createdDate: new Date(2020, 4, 16).getTime(),
      editedDate: new Date(2020, 4, 17).getTime(),
      async action({ modules }, path) {
        if (!modules.windows) {
          throw new Error('Windows module not found');
        }
        const moduleWindows = modules.windows;

        const executionResolve = core.addExecution();

        let model = reactive<Model>({
          value: getDefaultDocumentModel(),
          fsItem: undefined,
          [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: core.config.get(
            CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW
          )
        });

        if (path) {
          const fsItem = await modules.files?.fs.get(path);
          if (fsItem) {
            model = {
              ...model,
              fsItem: markRaw(fsItem),
              value: {
                ...model.value,
                ...getDefaultDocumentModel(),
                ...fsItem.data
              }
            };
          } else {
            throw new Error('File not found');
          }
        }

        const componentEditor =
          await import('./components/DocumentEditor.vue').then(
            module => module.default
          );

        const editorWindow = moduleWindows.addWindow(
          {
            component: componentEditor,
            componentData: {
              model,
              'onUpdate:content': (content: string) => {
                model.value.content = content;
              }
            },
            options: {
              title: 'Document Editor',
              scaleX: false,
              scaleY: false,
              scrollX: true,
              scrollY: true,
              center: false,
              embed: true,
              borderless: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'workbench13DocumentEditor',
            full: true
          }
        );

        function close() {
          editorWindow?.close();
        }
        function focus() {
          editorWindow?.focus();
        }
        function reset() {
          model.value = getDefaultDocumentModel();
          model.fsItem = undefined;
        }

        let previewWindow: Window;
        async function togglePreview(toggle = true) {
          if (toggle) {
            const component = await import('./components/Preview.vue').then(
              module => module.default
            );
            previewWindow = moduleWindows.addWindow(
              {
                component,
                componentData: { model },
                options: {
                  title: 'Preview - Document Editor',
                  scaleX: false,
                  scaleY: false,
                  scrollX: true,
                  scrollY: true,
                  center: false,
                  close: false,
                  embed: true,
                  borderless: true
                },
                layout: {
                  size: ipoint(540, 360)
                }
              },
              {
                group: 'workbench13DocumentEditor',
                active: false
              }
            );

            window.requestAnimationFrame(() => {
              moduleWindows.contentWrapper.setWindowPositions(
                WINDOW_POSITION.SPLIT_HORIZONTAL,
                [editorWindow, previewWindow],
                { embed: true }
              );
            });
          } else if (previewWindow) {
            previewWindow.close();
            editorWindow.unfocus();
            nextTick(() => {
              moduleWindows.contentWrapper.setWindowPositions(
                WINDOW_POSITION.SPLIT_HORIZONTAL,
                [editorWindow],
                { embed: true }
              );
              focus();
            });
          }
        }

        model.actions = {
          close,
          focus,
          reset,
          togglePreview,
          openInfo: () => openInfo(model)
        };

        core.modules.screen?.setTheme(themeWhiteContrast);

        executionResolve();
        return editorWindow.awaitClose().then(() => {
          core.modules.screen?.setTheme();
          previewWindow?.close();
          infoWindow?.close();
        });
      }
    }
  ];

  async function openInfo(model: Reactive<Model>) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows?.addWindow(
      {
        component: await import('./components/Info.vue').then(
          module => module.default
        ),
        componentData: {
          model
        },
        options: {
          title: 'Info'
        }
      },
      {
        group: 'workbench13DocumentEditor'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
